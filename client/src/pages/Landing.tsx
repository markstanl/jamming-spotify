import React from 'react'
import useDarkModeStyles from '@/utils/darkModeStyles';

interface LandingProps {
    isDarkMode: boolean;
    handleDarkToggle: () => void
}

const Landing: React.FC<LandingProps> = ({isDarkMode, handleDarkToggle}) => {

    const styles = useDarkModeStyles();

    const handleLogin = () => {
        window.location.href = 'http://localhost:3000/login';
    };

    return (
        <div className={`w-screen h-screen ${styles.bgBg} font-inter flex flex-col items-center gap-6 pt-6`}>
            <h1 className={`text-4xl ${styles.textText}`}>SpotifAI</h1>
            <button onClick={handleDarkToggle}
                    className={`${styles.bgAccent} ${styles.bgAccentHover} rounded-full w-36
                        ${styles.borderText} border-2`}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={handleLogin}
                    className={`${styles.bgAccent} ${styles.bgAccentHover} rounded-full w-36
                        ${styles.borderText} border-2`}>
                Login with Spotify
            </button>
        </div>
    )
}
export default Landing
