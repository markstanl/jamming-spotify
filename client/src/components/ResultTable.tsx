import React from 'react';
import SongResult from './SongResult';
import useDarkModeStyles from '@/utils/darkModeStyles';

type ResultTableProps = {
    resultSongs: (Song)[],
    setPlaylistSongs: React.Dispatch<React.SetStateAction<(Song)[]>>,
    playlistSongs: (Song)[]
}

const ResultTable: React.FC<ResultTableProps> = ({resultSongs, setPlaylistSongs, playlistSongs}) => {

    const styles = useDarkModeStyles();
    
    resultSongs && resultSongs.forEach((song) => {
        if(song) {
            song['inPlaylistTable'] = false;
        }
    })

    return (
        <div className={`flex flex-col min-h-screen w-7/12 items-center ${styles.bgPrimary} ${styles.textAccent}`}>
            <h1 className={'text-2xl font-bold'}>Result Songs</h1>
            {resultSongs.length > 0 ? resultSongs.map((song, index) => {
                    return (
                        <SongResult key={index} songObject={song} setPlaylistSongs={setPlaylistSongs}
                                    playlistSongs={playlistSongs}/>
                    )
            }) : <p>Search for some songs!</p>}
        </div>
    )
}
export default ResultTable
