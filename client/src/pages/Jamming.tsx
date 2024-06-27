import React, {useEffect, useState} from 'react'

// Components
import SearchBar from "@/components/SearchBar.tsx";
import ResultTable from "@/components/ResultTable.tsx";
import PlaylistTable from "@/components/PlaylistTable.tsx";
import GenerateTitle from "@/components/GenerateTitle.tsx";

// Utilities
import useDarkModeStyles from "@/utils/darkModeStyles.ts";
import {applyPlaylistAttribute, handleGetSongs} from "@/utils/methods.ts";

interface JammingProps {
    isDarkMode: boolean;
    handleDarkToggle: () => void;
}

const Jamming: React.FC<JammingProps> = ({isDarkMode, handleDarkToggle}) => {

    const styles = useDarkModeStyles();

    const [query, setQuery] = useState('')
    const [resultPlaylist, setResultPlaylist] = useState<Playlist>({} as Playlist)
    const [resultSongs, setResultSongs] = useState<(Song)[]>([])
    const [playlistSongs, setPlaylistSongs] = useState<(Song)[]>([])

    useEffect(() => {
        const fetchSongs = async () => {
            setResultSongs(applyPlaylistAttribute((await handleGetSongs(query))));
        };

        fetchSongs();
    }, [query]);

    useEffect(() => {
        console.log(playlistSongs)
    }, [playlistSongs])


    return (
        <div className={`flex flex-col w-screen items-center ${styles.bgBg} ${styles.textText} font-inter`}>
            <div className={'flex flex-col mt-6 items-center'}>
                <h1 className={`text-4xl font-inter font-bold ${styles.textPrimary}`}>Jammming</h1>
                <button onClick={handleDarkToggle}
                        className={`${styles.bgAccent} ${styles.bgAccentHover} rounded-full w-36
                        ${styles.borderText} border-2`}>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            <div className={'flex flex-col mt-4 items-center h-full w-2/3'}>
                <SearchBar setQuery={setQuery}/>
                <div className={'flex flex-row h-full w-full p-2 gap-4'}>
                    <ResultTable resultSongs={resultSongs} setPlaylistSongs={setPlaylistSongs}
                                 playlistSongs={playlistSongs}/>
                    <PlaylistTable playlistSongs={playlistSongs} setPlaylistSongs={setPlaylistSongs}
                                   setResultPlaylist={setResultPlaylist}/>
                </div>
                <GenerateTitle resultPlaylist={resultPlaylist}/>
            </div>
        </div>
    )
}
export default Jamming
