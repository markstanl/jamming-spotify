declare global {
    type ServerSong = {
        title: string;
        artist: string;
        album: string;
        URI: string;
    };

    type ServerPlaylist = {
        playlistImage: string;
        songs: ServerSong[];
    };
}

import 'express-session';

declare module 'express-session' {
    interface SessionData {
        access_token: string;
        refresh_token: string;
    }
}

export {};
