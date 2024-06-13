
// This overarching file contains JavaScript to display the various components of the application.
import { useState } from 'react'
import { useLocation, Outlet } from 'react-router-dom';

import Header from './components/Header/Header.jsx'
import Game from './pages/Game/Game.jsx'
import Footer from './components/Footer/Footer.jsx';



function App() {

    const location = useLocation();
    const currentPath = location.pathname;

    let pages = [

        { name: 'Game', path: '/' },
        { name: 'Instructions', path: '/instructions' },
    ]

    const activePage = pages.find((page) => page.path === currentPath);

    const [activeSection, setActiveSection] = useState(activePage.name);

    function changeActiveSection(section){

        setActiveSection(section)
        
    }
    
    return (
        
        <div>
            <Header navButtonClicked={changeActiveSection} />
            <Game/>
            <Footer />
        </div>
    )
}

export default App