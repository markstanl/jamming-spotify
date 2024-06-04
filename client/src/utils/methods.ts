// Some helper methods for the client side
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
 * @param playlistName - the name of the playlist
 * @param playlistSongs - the songs in the playlist
 */
const handleSavePlaylist = (playlistName: string, playlistSongs: (Song)[]) => {
    console.log(`Playlist Name: ${playlistName}`);
    console.log(`playlistSongs`);

}

export {applyPlaylistAttribute, songExistsInArrayWithoutPlaylistTable, handleSavePlaylist}