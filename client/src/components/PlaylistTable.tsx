import React, {useState} from 'react'
import SongResult from "@/components/SongResult.tsx";
import useDarkModeStyles from '@/utils/darkModeStyles';
import {handleSavePlaylist} from "@/utils/methods.ts";


type PlaylistTableProps = {
    playlistSongs: (Song)[],
    setPlaylistSongs: React.Dispatch<React.SetStateAction<(Song)[]>>
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({playlistSongs, setPlaylistSongs}) => {

    const styles = useDarkModeStyles();
    const [playlistName, setPlaylistName] = useState('')

    playlistSongs && playlistSongs.forEach((song) => {
        if(song) {
            song['inPlaylistTable'] = true;
        }
    })

    return (
        <div className={`w-5/12 min-h-screen flex flex-col ${styles.bgPrimary} items-center`}>
            <h1 className={`text-2xl font-bold ${styles.textAccent}`}>Playlist</h1>
            <input className={`bg-transparent mb-2  focus:outline-none p-1 ${styles.textBg}
                        border-b-2 ${styles.borderText} w-10/12`}
                   placeholder={'Playlist Name'}
                   value={playlistName}
                   onChange={(e) => setPlaylistName(e.target.value)}
            />

            {playlistSongs.length > 0 ? playlistSongs.map((song, index) => {
                return (
                    <SongResult key={index} songObject={song} setPlaylistSongs={setPlaylistSongs}
                                playlistSongs={playlistSongs}/>
                )
            }) : <p>Add some songs!</p>}

            <button className={`rounded-full w-36 mt-2 ${styles.bgAccent} ${styles.bgAccentHover}
                    ${styles.borderText} border-2`}
                    onClick={() => {
                        handleSavePlaylist(playlistName, playlistSongs)
                    }}
            > Save Playlist
            </button>
        </div>
    )
}
export default PlaylistTable
