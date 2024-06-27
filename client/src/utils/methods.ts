import React from 'react'


/**
 * Adds a boolean attribute of inPlaylistTable to each song in the playlist
 * @param playlist - an array of songs
 * @returns an array of songs with the inPlaylistTable attribute set to false
 */
const applyPlaylistAttribute = (playlist: SongInput[]): Song[] => {

    playlist.forEach((song: SongInput & Partial<Song>) => {
        song.inPlaylistTable = false;
    });

    return playlist as Song[];
}

/**
 * Checks to see if a song of same title, artist, and albums exists in an array of songs
 * Necessary as the playlist table is made up of copies, not the same object
 * @param song - a song object to check
 * @param songArray - an array of song objects
 * @returns true if some object in the array is the same, false else
 */
const songExistsInArrayWithoutPlaylistTable = (song: Song | null, songArray: (Song)[]): boolean => {
    if (!song) return false;

    return songArray.some((songObject) => {
        return songObject &&
            songObject.title === song.title &&
            songObject.artist === song.artist &&
            songObject.album === song.album;
    });
}

/**
 * Handles saving a playlist
 * @param playlistImage - the name of the playlist
 * @param playlistSongs - the songs in the playlist
 * @param setResultPlaylist - the state setter for the playlist
 */
const handleSavePlaylist = (playlistImage: string, playlistSongs: (Song)[],
                            setResultPlaylist: React.Dispatch<React.SetStateAction<Playlist>>) => {
    const playlist: Playlist = {
        playlistImage: playlistImage,
        songs: playlistSongs
    }
    console.log('playlist:', playlist);
    setResultPlaylist(playlist)
}

/**
 * Handles saving a playlist to Spotify
 * @param playlist - the playlist to save
 * @param playlistTitle - the title of the playlist
 */
const handleSavePlaylistSpotify = async (playlist: Playlist, playlistTitle: string): Promise<boolean> => {

    const backendSongs: SongInput[] = playlist.songs.map((song) => {
        return {
            title: song.title,
            artist: song.artist,
            album: song.album,
            uri: song.uri
        }
    })

    const backendPlaylist: SavePlaylist = {
        playlistImage: playlist.playlistImage,
        playlistTitle: playlistTitle,
        songs: backendSongs
    }

    try {
        const response = await fetch('http://localhost:3000/save-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playlist: backendPlaylist
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;

    } catch (e) {
        console.log(e)
        throw new Error('Error saving playlist');
    }

}

/**
 * Handles the server generating a title for the playlist
 * @param resultPlaylist - the playlist to generate a title for
 */
const handleServerGenerateTitle = async (resultPlaylist: Playlist): Promise<string> => {

    const backendPlaylist: BackendPlaylist = {
        playlistImage: resultPlaylist.playlistImage,
        songs: []
    }

    console.log(backendPlaylist.playlistImage)

    console.log(JSON.stringify(backendPlaylist))

    for (const song of resultPlaylist.songs) {
        backendPlaylist.songs.push({
            title: song.title,
            artist: song.artist,
            album: song.album,
            uri: song.uri
        })
    }
    try {
        const response = await fetch('http://localhost:3000/generate-title', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playlist: backendPlaylist
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('Response text:', responseText);

        const data = JSON.parse(responseText);
        console.log('Parsed data:', data);

        return data.title;

    } catch (e) {
        console.log(e)
        throw new Error('Error generating title');
    }
}

/**
 * Handles getting songs from the server
 * @param query - the query to search for
 */
const handleGetSongs = async (query: string): Promise<SongInput[]> => {
    try {
        const access_token = 'retrieve access_token from session'; // Example: You need to retrieve the access token from your session

        const response = await fetch(`http://localhost:3000/search?q=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const songResponseRaw = data['tracks']['items'];

        return songResponseRaw.map((song: never) => {
            return {
                title: song['name'],
                artist: song['artists'][0]['name'],
                album: song['album']['name'],
                uri: song['uri']
            };
        }) as SongInput[];

    } catch (error) {
        console.error('Error getting songs:', error);
        throw new Error('Error getting songs');
    }
};

export {
    applyPlaylistAttribute,
    songExistsInArrayWithoutPlaylistTable,
    handleSavePlaylist,
    handleServerGenerateTitle,
    handleGetSongs,
    handleSavePlaylistSpotify
}