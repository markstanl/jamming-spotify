import {useContext} from 'react';
import DarkModeContext from './DarkModeContext';

const useDarkModeStyles = () => {
    const {isDarkMode} = useContext(DarkModeContext);

    const bgBg: string = isDarkMode ? 'bg-dark-bg' : 'bg-bg';
    const bgPrimary: string = isDarkMode ? 'bg-dark-primary' : 'bg-primary';
    const bgSecondary: string = isDarkMode ? 'bg-dark-secondary' : 'bg-secondary';
    const bgAccent: string = isDarkMode ? 'bg-dark-accent' : 'bg-accent';
    const bgAccentHover: string = isDarkMode ? 'hover:bg-dark-accent-hover' : 'hover:bg-accent-hover';

    const textBg: string = isDarkMode ? 'text-dark-bg' : 'text-bg';
    const textText: string = isDarkMode ? 'text-dark-text' : 'text-text';
    const textPrimary: string = isDarkMode ? 'text-dark-primary' : 'text-primary';
    const textAccent: string = isDarkMode ? 'text-dark-accent' : 'text-accent';

    const borderText = isDarkMode ? 'border-dark-text' : 'border-text';
    const borderPrimary = isDarkMode ? 'border-dark-primary' : 'border-primary';

    const focusPrimary = 'focus:outline-none focus:ring-2 ' + (isDarkMode ? 'focus:ring-dark-primary' : 'focus:ring-primary');
    const focusText = 'focus:outline-none focus:ring-2 ' + (isDarkMode ? 'focus:ring-dark-text' : 'focus:ring-text');

    return {
        bgBg,
        bgPrimary,
        bgSecondary,
        bgAccent,
        bgAccentHover,

        textText,
        textPrimary,
        textBg,
        textAccent,

        borderText,
        borderPrimary,
        focusPrimary,

        focusText,
    };
};

export default useDarkModeStyles;