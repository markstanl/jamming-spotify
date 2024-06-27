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
const express_session_1 = __importDefault(require("express-session"));
const session_file_store_1 = __importDefault(require("session-file-store"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
const FileStoreSession = (0, session_file_store_1.default)(express_session_1.default);
app.use((0, express_session_1.default)({
    store: new FileStoreSession({
        path: './sessions', // Ensure this path is correct and writable
        ttl: 3600, // Session expiration time in seconds (1 hour)
        retries: 1,
    }),
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
}));
// Middleware configuration
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
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
app.get('/check-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("HERE");
    console.log(req.session);
    console.log(yield fetch('http://localhost:3000/check-session'));
    const access_token = req.session.access_token;
    const query = req.query.q;
    if (!access_token) {
        return res.status(401).send('Unauthorized');
    }
    if (query) {
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
    }
}));
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.session);
    console.log(yield fetch('http://localhost:3000/check-session'));
    const access_token = req.session.access_token;
    const query = req.query.q;
    if (!access_token) {
        return res.status(401).send('Unauthorized');
    }
    if (query) {
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
    }
}));
app.post('/generate-title', (req, res) => {
    const requestBody = req.body['playlist'];
    const playlistImage = requestBody.playlistImage;
    const songs = requestBody.songs;
    res.send({ title: 'Fortnite' });
});
app.post('/save-playlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Start');
    console.log(req.session);
    const playlistImage = req.body.playlistImage;
    const playlistTitle = req.body.playlistTitle;
    const songs = req.body.songs;
    const access_token = req.session.access_token;
    if (!access_token) {
        console.log('No access token');
        return res.status(401).send('Unauthorized');
    }
    console.log('passed acces token');
    try {
        console.log('create playlist');
        const userId = yield getUserId(access_token);
        const songUris = songs.map(song => song.uri);
        // Create a new playlist
        const createPlaylistOptions = {
            method: 'post',
            url: `${baseUrl}/v1/users/${userId}/playlists`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            data: {
                name: playlistTitle,
                description: 'Playlist generated with Jamming',
                public: false
            }
        };
        console.log('Add songs');
        const createResponse = yield (0, axios_1.default)(createPlaylistOptions);
        const playlistId = createResponse.data.id;
        // Add songs to the playlist
        const addSongsOptions = {
            method: 'post',
            url: `${baseUrl}/v1/playlists/${playlistId}/tracks`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
            data: {
                uris: songUris,
                position: 0
            }
        };
        yield (0, axios_1.default)(addSongsOptions);
        console.log('Set image');
        // Set the playlist image
        if (playlistImage) {
            const setImageOptions = {
                method: 'put', // Updated to 'put' as Spotify's API requires this method for setting images
                url: `${baseUrl}/v1/playlists/${playlistId}/images`,
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'image/jpeg'
                },
                data: playlistImage
            };
            yield (0, axios_1.default)(setImageOptions);
        }
        res.send('Playlist saved');
    }
    catch (error) {
        console.error('Error saving playlist', error);
        res.status(500).send('Error saving playlist');
    }
}));
// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
