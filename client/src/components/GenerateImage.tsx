import React, {useState, useEffect} from 'react'
import useDarkModeStyles from '@/utils/darkModeStyles';

type GenerateImageProps = {
    resultPlaylist: Playlist
}

const GenerateImage: React.FC<GenerateImageProps> = ({resultPlaylist}) => {

    const styles = useDarkModeStyles()
    const [canGenerateTitle, setCanGenerateTitle] = useState(false)

    // Hook that allows the rest of the code to generate only when a playlist is saved
    useEffect(() => {
        if ('playlistImage' in resultPlaylist) {
            setCanGenerateTitle(typeof resultPlaylist.playlistImage === 'string')
        } else setCanGenerateTitle(false)
    }, [resultPlaylist]);

    const handleGenerateImage = () => {

    }

    const determineButtonStyles = (): string =>{
        return canGenerateTitle ? `${styles.bgAccent} ${styles.bgAccentHover}` : 'bg-slate-500 text-white cursor-none'
    }

    return (
        <div className={`w-1/3 ${styles.bgPrimary} flex flex-col items-center
                           gap-2 p-1`}>
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
                onClick={handleGenerateImage}>
                Generate Playlist Image
            </button>

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

export default GenerateImage
