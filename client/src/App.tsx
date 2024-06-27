import SearchBar from './components/SearchBar'
import React, {useState, useEffect} from 'react'

// Utilities
import DarkModeContext from '@/utils/DarkModeContext.tsx';

//Pages
import Router from '@/Router.tsx';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const handleDarkToggle = () => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <DarkModeContext.Provider value={{isDarkMode, toggleDarkMode: handleDarkToggle}}>
            <AppContent isDarkMode={isDarkMode} handleDarkToggle={handleDarkToggle}/>
        </DarkModeContext.Provider>
    )
}

type AppContentProps = {
    isDarkMode: boolean;
    handleDarkToggle: () => void;
};

const AppContent: React.FC<AppContentProps> = ({isDarkMode, handleDarkToggle}) => {
    return <Router isDarkMode={isDarkMode} handleDarkToggle={handleDarkToggle} />
}

export default App