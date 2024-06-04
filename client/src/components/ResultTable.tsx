import React from 'react';
import SongResult from './SongResult';
import useDarkModeStyles from '@/utils/darkModeStyles';

type ResultTableProps = {
    resultSongs: ({
        title: string;
        artist: string;
        album: string;
    } | null)[]

}

const ResultTable: React.FC<ResultTableProps> = ({resultSongs}) => {

    const styles = useDarkModeStyles();

    return (
        <div className={`flex flex-col min-h-screen w-7/12 items-center ${styles.bgPrimary} ${styles.textAccent}`}>
            <h1 className={'text-2xl font-bold'}>Result Songs</h1>
            {resultSongs.map((song, index) => {
                return (
                    <SongResult key={index} songObject={song}/>
                )
            })}
        </div>
    )
}
export default ResultTable
