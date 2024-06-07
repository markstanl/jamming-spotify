import React, {useState, useEffect} from 'react'
import useDarkModeStyles from '@/utils/darkModeStyles';

type GenerateImageProps = {
    resultPlaylist: Playlist
}

const GenerateImage: React.FC<GenerateImageProps> = ({resultPlaylist}) => {

    const styles = useDarkModeStyles()
    const [canGenerateImage, setCanGenerateImage] = useState(false)

    // Hook that allows the rest of the code to generate only when a playlist is saved
    useEffect(() => {
        if ('title' in resultPlaylist) {
            setCanGenerateImage(typeof resultPlaylist.title === 'string')

        } else setCanGenerateImage(false)
    }, [resultPlaylist]);

    const handleGenerateImage = () => {

    }

    const determineButtonStyles = (): string =>{
        return canGenerateImage ? `${styles.bgAccent} ${styles.bgAccentHover}` : 'bg-slate-500 text-white cursor-none'
    }

    return (
        <div className={`w-1/3 ${styles.bgPrimary} flex flex-col items-center
                           gap-2 p-1 ${determineButtonStyles}`}>
            {canGenerateImage &&
                <div className={'flex flex-col items-center'}>
                    <h1>You are about to generate a playlist cover for the following playlist:</h1>
                    <h2>{resultPlaylist.title}</h2>
                    {resultPlaylist.songs.map((song, index) => {
                        return <SongComponent song={song} key={index}/>
                    })}
                </div>
            }
            <button
                className={`rounded-full w-36 ml-2
                    ${styles.borderText} border-2`}
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
