import React, {useState, useRef, useEffect} from 'react'
import SongResult from "@/components/SongResult.tsx";
import useDarkModeStyles from '@/utils/darkModeStyles';
import {handleSavePlaylist} from "@/utils/methods.ts";


type PlaylistTableProps = {
    playlistSongs: (Song)[],
    setPlaylistSongs: React.Dispatch<React.SetStateAction<(Song)[]>>
    setResultPlaylist: React.Dispatch<React.SetStateAction<Playlist>>
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({
                                                         playlistSongs, setPlaylistSongs
                                                         , setResultPlaylist
                                                     }) => {

    const styles = useDarkModeStyles();
    const [playlistImage, setPlaylistImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [inputKey, setInputKey] = useState(Math.random().toString()); // stack exchange said this will work to force a rerender on the input component


    /**
     * Checks to see if the playlist is ready to be submitted
     */
    const validSubmit = (): boolean => {
        return playlistSongs.length > 0 && playlistImage != '';
    }

    /**
     * Handles the image upload
     * @param e - the event
     */
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        setPlaylistImage(reader.result as string);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }

    const handleClearImage = () => {
        setInputKey(prevKey => prevKey + 0.00001);
        setPlaylistImage('');
    }


    playlistSongs && playlistSongs.forEach((song) => {
        if (song) {
            song['inPlaylistTable'] = true;
        }
    })

    return (
        <div className={`w-5/12 min-h-screen flex flex-col ${styles.bgPrimary} items-center`}>
            <h1 className={`text-2xl font-bold ${styles.textAccent}`}>Playlist</h1>
            <input type="file"
                   accept="image/*"
                   key={inputKey}
                   className={`bg-transparent mb-2  focus:outline-none p-1 ${styles.textBg}
                   border-b-2 ${styles.borderText} w-10/12`}
                   onChange={(e) => {
                       handleImageUpload(e)
                   }}
            />
            <button onClick={handleClearImage}>Clear Image</button>

            {playlistSongs.length > 0 ? playlistSongs.map((song, index) => {
                return (
                    <SongResult key={index} songObject={song} setPlaylistSongs={setPlaylistSongs}
                                playlistSongs={playlistSongs}/>
                )
            }) : <p>Add some songs!</p>}

            <button className={`rounded-full w-36 mt-2 ${styles.bgAccent} ${styles.bgAccentHover}
                    ${styles.borderText} border-2`}
                    onClick={() => {
                        if (validSubmit()) {
                            handleSavePlaylist(playlistImage, playlistSongs, setResultPlaylist)
                            setErrorMessage('');
                        } else {
                            playlistImage === '' ? setErrorMessage('Add a playlist image before submitting') :
                                setErrorMessage('Add some songs before submitting')
                        }
                    }}
            > Save Playlist
            </button>
            <p>{errorMessage}</p>
        </div>
    )
}
export default PlaylistTable
