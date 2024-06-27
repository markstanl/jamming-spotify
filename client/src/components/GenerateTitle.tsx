import React, {useState, useEffect} from 'react'
import useDarkModeStyles from '@/utils/darkModeStyles';
import {handleServerGenerateTitle, handleSavePlaylistSpotify} from '@/utils/methods';

type GenerateImageProps = {
    resultPlaylist: Playlist
}

const GenerateTitle: React.FC<GenerateImageProps> = ({resultPlaylist}) => {

    const styles = useDarkModeStyles()
    const [canGenerateTitle, setCanGenerateTitle] = useState(false)
    const [title, setTitle] = useState('')
    const [saveStatus, setSaveStatus] = useState('')

    // Hook that allows the rest of the code to generate only when a playlist is saved
    useEffect(() => {
        if ('playlistImage' in resultPlaylist) {
            setCanGenerateTitle(typeof resultPlaylist.playlistImage === 'string')
        } else setCanGenerateTitle(false)
    }, [resultPlaylist]);

    const handleGenerateTitle = () => {
        if (canGenerateTitle) {
            handleServerGenerateTitle(resultPlaylist).then((response) => {
                setTitle(response)
            }).catch((error) => {
                console.error('Error generating title', error)
            })
        }
    }

    const handleSavePlaylistSpotifyClient = (playlist: Playlist, playlistTitle: string) => {
        handleSavePlaylistSpotify(playlist, playlistTitle).then((response) => {
            setSaveStatus('Playlist saved, check your spotify')
        }).catch((error) => {
            setSaveStatus(error.message)
        })
    }

    const determineButtonStyles = (): string => {
        if (canGenerateTitle) {
            console.log('yes')
            return `${styles.bgAccent} ${styles.bgAccentHover}`}
        else{
            console.log('no')
            return 'bg-slate-500 text-white cursor-none'
        }
    }

    return (
        <div className={`w-1/3 ${styles.bgPrimary} flex flex-col items-center
                           gap-2 p-1 mb-4`}>
            {canGenerateTitle &&
                <div className={'flex flex-col items-center'}>
                    <h1>You are about to generate a title for the following playlist:</h1>
                    <div className={`flex flex-row justify-center w-1/3 ${styles.bgAccent} p-2 rounded-md`}>
                        {canGenerateTitle && <img src={resultPlaylist.playlistImage} alt="Playlist"
                                                  className={'w-full'}/>}
                    </div>
                    {resultPlaylist.songs.map((song, index) => {
                        return <SongComponent song={song} key={index}/>
                    })}
                </div>
            }
            <button
                className={`rounded-full w-36 ml-2
                    ${styles.borderText} border-2 ${determineButtonStyles}`}
                onClick={handleGenerateTitle}>
                Generate Playlist Title
            </button>
            {title && <>
                <hr/>
                <p>You have just generated the following playlist</p>
                <img src={resultPlaylist.playlistImage} alt="Playlist" className={'w-1/3'}/>
                <h1>{title}</h1>
                <button className={`rounded-full w-36 ml-2 ${styles.bgAccent} ${styles.bgAccentHover}`}
                onClick={() => handleSavePlaylistSpotifyClient(resultPlaylist, title)}>
                    Save Playlist
                </button>
            </>
            }
            {saveStatus && <p>{saveStatus}</p>}
        </div>
    )
}

type SongComponentProps = {
    song: Song
}

const SongComponent: React.FC<SongComponentProps> = ({song}) => {
    return (
        <div className={'w-full m-1'}>
            <p className={'text-center'}>{song.title}</p>
        </div>
    )
}

export default GenerateTitle
