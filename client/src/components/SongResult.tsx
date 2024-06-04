import React from 'react';
import useDarkModeStyles from '@/utils/darkModeStyles';

type SongResultProps = {
    songObject: {
        title: string;
        artist: string;
        album: string;
    } | null

}

const SongResult: React.FC<SongResultProps> = ({songObject}) => {

    let title, artist, album;

    if (!songObject) {
        title = 'Default Song Object';
        artist = 'danny devito';
        album = 'albummmmm';
    } else {
        ({title, artist, album} = songObject);
    }

    const styles = useDarkModeStyles();

    return (
        <div className={`h-16 w-full ${styles.bgPrimary} ${styles.textBg} flex flex-row justify-between p-2`}>
            <div className={'flex flex-col'}>
                <h1>{title}</h1>
                <h2>{artist}</h2>
            </div>
            <p>
                {album}
            </p>
        </div>
    )
}
export default SongResult
