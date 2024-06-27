import React from 'react'
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import Jamming from '@/pages/Jamming';
import Landing from '@/pages/Landing';

interface RouterProps {
    isDarkMode: boolean;
    handleDarkToggle: () => void;
}

const Redirect: React.FC = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/');
    }, [navigate]);

    return null;
}

const Router: React.FC<RouterProps> = ({isDarkMode, handleDarkToggle}) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing isDarkMode={isDarkMode} handleDarkToggle={handleDarkToggle}/>} />
                <Route path="/jamming" element={<Jamming isDarkMode={isDarkMode} handleDarkToggle={handleDarkToggle}/>} />
                <Route path="*" element={<Redirect />} />
            </Routes>
        </BrowserRouter>
    )
}
export default Router
