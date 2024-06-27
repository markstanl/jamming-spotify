import express from 'express';
import cors from 'cors';
import axios from 'axios';
import session from 'express-session';
import FileStore from 'session-file-store';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const FileStoreSession = FileStore(session);

app.use(session({
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
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


// Spotify API configuration
const baseUrl = 'https://api.spotify.com';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';

const getUserId = async (access_token: string): Promise<string> => {
    try {
        const userOptions = {
            method: 'get',
            url: `${baseUrl}/v1/me`,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        const response = await axios(userOptions);
        return response.data.id; // The user's Spotify User ID
    } catch (error) {
        console.error('Error getting user ID', error);
        throw new Error('Error getting user ID');
    }
};

// Routes
app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id!,
        scope: scope,
        redirect_uri: redirect_uri,
        state: 'some-state'
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code as string || null;
    const state = req.query.state as string || null;

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
        const response = await axios(authOptions);
        const {access_token, refresh_token} = response.data;

        // Store tokens in session
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;

        res.redirect(`http://localhost:5173/jamming`);
    } catch (error) {
        console.error('Error getting access token', error);
        res.status(500).send('Error getting access token');
    }
});

app.get('/check-session', async (req, res) => {
    const access_token = req.session.access_token;
    res.send(req.session);
});

app.get('/search', async (req, res) => {
    console.log(req.session)
    console.log(await fetch('http://localhost:3000/check-session'))
    const access_token = req.session.access_token;
    const query = req.query.q as string;

    if (!access_token) {
        return res.status(401).send('Unauthorized');
    }
    if(query) {
        try {
            const searchOptions = {
                method: 'get',
                url: `${baseUrl}/v1/search?q=${encodeURIComponent(query)}&type=track`,
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            };

            const response = await axios(searchOptions);
            res.json(response.data);
        } catch (error) {
            console.error('Error searching tracks', error);
            res.status(500).send('Error searching tracks');
        }
    }
});

app.post('/generate-title', (req, res) => {
    const requestBody: ServerPlaylist = req.body['playlist'];
    const playlistImage = requestBody.playlistImage;
    const songs: ServerSong[] = requestBody.songs;

    res.send({title: 'Fortnite'});
});

app.post('/save-playlist', async (req, res) => {
    console.log('Start')
    console.log(req.session)
    const playlistImage = req.body.playlistImage;
    const playlistTitle = req.body.playlistTitle;
    const songs: ServerSong[] = req.body.songs;
    const access_token = req.session.access_token;

    if (!access_token) {
        console.log('No access token')
        return res.status(401).send('Unauthorized');
    }
    console.log('passed acces token')

    try {

        console.log('create playlist')
        const userId: string = await getUserId(access_token);
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

        console.log('Add songs')
        const createResponse = await axios(createPlaylistOptions);
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

        await axios(addSongsOptions);

        console.log('Set image')
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

            await axios(setImageOptions);
        }

        res.send('Playlist saved');
    } catch (error) {
        console.error('Error saving playlist', error);
        res.status(500).send('Error saving playlist');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
