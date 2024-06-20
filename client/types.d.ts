declare global {
    type SongInput = {
        title: string;
        artist: string;
        album: string;
    };

    type Song = SongInput & {
        inPlaylistTable: boolean;
    };

    type Playlist = {
        playlistImage: string;
        songs: Song[];
    }
}

export {}