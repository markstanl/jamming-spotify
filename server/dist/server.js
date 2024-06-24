"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
// Frankly this cookie stuff was a large part chatgpt
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true if https
}));
// Spotify API configuration
const baseUrl = 'https://api.spotify.com';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';
const getUserId = (access_token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userOptions = {
            method: 'get',
            url: `${baseUrl}/v1/me`,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };
        const response = yield (0, axios_1.default)(userOptions);
        return response.data.id; // The user's Spotify User ID
    }
    catch (error) {
        console.error('Error getting user ID', error);
        throw new Error('Error getting user ID');
    }
});
// Routes
app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: 'some-state'
    });
    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});
app.get('/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code || null;
    const state = req.query.state || null;
    if (!code || !state) {
        return res.status(400).send('Invalid callback parameters');
    }
    const authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }).toString(),
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    try {
        const response = yield (0, axios_1.default)(authOptions);
        const { access_token, refresh_token } = response.data;
        // Store tokens in session
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        res.redirect(`http://localhost:5173/jamming`);
    }
    catch (error) {
        console.error('Error getting access token', error);
        res.status(500).send('Error getting access token');
    }
}));
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const access_token = req.session.access_token;
    if (!access_token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const searchOptions = {
            method: 'get',
            url: `${baseUrl}/v1/search?q=${encodeURIComponent(query)}&type=track`,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };
        const response = yield (0, axios_1.default)(searchOptions);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error searching tracks', error);
        res.status(500).send('Error searching tracks');
    }
}));
app.post('/generate-title', (req, res) => {
    const requestBody = req.body['playlist'];
    const playlistImage = requestBody.playlistImage;
    const songs = requestBody.songs;
    res.send({ title: 'Fortnite' });
});
app.get('/check-session', (req, res) => {
    res.send(req.session);
});
app.post('/save-playlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('this was called');
    const playlistImage = req.query.playlistImage;
    const playlistTitle = req.query.playlistTitle;
    const songs = req.body.songs;
    const access_token = req.session.access_token;
    console.log(access_token);
    if (!access_token) {
        console.log('access toekn');
        return res.status(401).send('Unauthorized');
    }
    console.log('asdfasdf');
    const userId = yield getUserId(access_token);
    const songUris = songs.map(song => song.URI);
    let playlistId = '';
    // Create a new playlist
    try {
        const searchOptions = {
            method: 'post',
            url: `${baseUrl}/v1/users?user_id=${userId}/playlists`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            data: {
                name: playlistTitle,
                description: 'Playlist generate with Jamming',
                public: false
            }
        };
        console.log('before');
        const response = yield (0, axios_1.default)(searchOptions);
        console.log('after');
        playlistId = response.data.id;
    }
    catch (error) {
        console.error('Error searching tracks', error);
        res.status(500).send('Error searching tracks');
    }
    // Add songs to the playlist
    try {
        const searchOptions = {
            method: 'post',
            url: `${baseUrl}/v1/playlists/${playlistId}/tracks`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                "uris": songUris,
                position: 0
            }
        };
        const response = yield (0, axios_1.default)(searchOptions);
    }
    catch (error) {
        console.error('Error adding songs', error);
        res.status(500).send('Error adding songs');
    }
    // set the playlist image
    try {
        const searchOptions = {
            method: 'post',
            url: `${baseUrl}/v1/playlists/${playlistId}/images`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
            data: playlistImage
        };
        const response = yield (0, axios_1.default)(searchOptions);
    }
    catch (error) {
        console.error('Error changing playlist image', error);
        res.status(500).send('Error changing playlist image');
    }
    res.send('Playlist saved');
}));
// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
