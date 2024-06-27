declare global {
    type SongInput = {
        title: string;
        artist: string;
        album: string;
        uri: string;
    };

    type Song = SongInput & {
        inPlaylistTable: boolean;
    };

    type Playlist = {
        playlistImage: string;
        songs: Song[];
    }

    type BackendPlaylist = {
        playlistImage: string;
        songs: SongInput[];
    }

    type SavePlaylist = {
        playlistImage: string;
        playlistTitle: string;
        songs: SongInput[];
    }
}

export {}