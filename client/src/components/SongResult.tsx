import React, {useContext} from 'react';
import useDarkModeStyles from '@/utils/darkModeStyles';
import {songExistsInArrayWithoutPlaylistTable} from "@/utils/methods.ts";

type SongResultProps = {
    songObject: Song,
    setPlaylistSongs: React.Dispatch<React.SetStateAction<(Song)[]>>
    playlistSongs?: (Song)[]

}

const SongResult: React.FC<SongResultProps> = ({songObject, setPlaylistSongs, playlistSongs}) => {

    let title, artist, album;

    if (!songObject) {
        title = 'Default Song Object';
        artist = 'danny devito';
        album = 'albummmmm';
    } else {
        ({title, artist, album} = songObject);
    }

    const styles = useDarkModeStyles();

    const addOrRemove = () =>{
        if(songObject){
            if(songObject.inPlaylistTable){
                return '-'
            }else return '+'
        }else return '?'
    }

    const handleAdd = () => {
        setPlaylistSongs((prev) => {
            const newPlaylist = [...prev];
            console.log(`songObject: ${songObject}`)
            console.log(`playlistSongs: ${playlistSongs}`)
            if (songObject && (!playlistSongs || !songExistsInArrayWithoutPlaylistTable(songObject, playlistSongs))){
                const songCopy = {...songObject, inPlaylistTable: true};
                newPlaylist.push(songCopy);
            }
            return newPlaylist;
        })
    }

    const handleRemove = () =>{
        setPlaylistSongs((prev) => {
            const newPlaylist = [...prev];
            newPlaylist.splice(newPlaylist.indexOf(songObject), 1);
            return newPlaylist;
        })
    }


    return (
        <div className={`h-16 w-full ${styles.bgPrimary} ${styles.textBg} flex flex-row justify-between p-2
            border-b-2 ${styles.borderText}`}>
            <div className={'flex flex-col'}>
                <h1>{title}</h1>
                <h2>{artist}</h2>
            </div>
            <div className={'flex flex-col'}>
                <p>{album}</p>
                <button
                    onClick={() => {
                        console.log(songObject)
                            if(songObject.inPlaylistTable){
                                handleRemove()
                            }else handleAdd()
                    }}
                >{addOrRemove()}</button>
            </div>
        </div>
    )
}
export default SongResult
