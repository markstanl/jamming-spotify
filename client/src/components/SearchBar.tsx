import React, {useState} from 'react';
import useDarkModeStyles from '@/utils/darkModeStyles';

type SearchBarProps = {
    setQuery: (query: string) => void;
};


const SearchBar: React.FC<SearchBarProps> = ({setQuery}) => {
    const styles = useDarkModeStyles();
    const [input, setInput] = useState('')

    return (
        <div className={'flex flex-row'}>
            <input className={`rounded-full w-96 p-2 ${styles.bgPrimary} ${styles.textBg} ${styles.focusText}`}
                   placeholder={'Search for songs...'}
                   value={input} onChange={(e) => setInput(e.target.value)}
            />
            <button className={`rounded-full w-36 ml-2 ${styles.bgAccent} ${styles.bgAccentHover}
                    ${styles.borderText} border-2`}
                    onClick={() => {
                        setQuery(input)
                        setInput('')
                    }}
            > Search
            </button>

        </div>
    )
}
export default SearchBar