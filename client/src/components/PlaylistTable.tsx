import React, {useState} from 'react'
import SongResult from "@/components/SongResult.tsx";
import useDarkModeStyles from '@/utils/darkModeStyles';

type PlaylistTableProps = {
    playlistSongs: ({
        title: string;
        artist: string;
        album: string;
    } | null)[]

}

const PlaylistTable: React.FC<PlaylistTableProps> = ({playlistSongs}) => {

    const styles = useDarkModeStyles();
    const [playlistName, setPlaylistName] = useState('')

    return (
        <div className={`w-5/12 min-h-screen flex flex-col ${styles.bgPrimary} items-center`}>
            <h1 className={`text-2xl font-bold ${styles.textAccent}`}>Playlist</h1>
            <input className={`bg-transparent mb-2  focus:outline-none p-1 ${styles.textBg}
                        border-b-2 ${styles.borderText} w-10/12`}
                   placeholder={'Playlist Name'}
                   value={playlistName}
                   onChange={(e) => setPlaylistName(e.target.value)}
            />

            {playlistSongs.map((song, index) => {
                return (
                    <SongResult key={index} songObject={song}/>
                )
            })}

            <button className={`rounded-full w-36 mt-2 ${styles.bgAccent} ${styles.bgAccentHover}
                    ${styles.borderText} border-2`}
                    onClick={() => {
                        console.log(playlistName)
                    }}
            > Save Playlist
            </button>
        </div>
    )
}
export default PlaylistTable
