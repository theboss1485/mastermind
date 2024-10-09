import './Header.css'
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

export default function Header(){

    const [title, setTitle] = useState(null);
    
    const gameTitle = useSelector((state) => state.dynamic.gameTypeArray ? state.dynamic.gameTypeArray[1] : "Mastermind");

    useEffect(() => {
        // switch (gameType) {
        //     case "mini":
        //         setTitle("Mini Mastermind")
        //         break;
        //     case "regular":
        //         setTitle("Standard Mastermind")
        //         break;
        //     case "super":
        //         setTitle("Super Mastermind")
        //         break;
        //     default:
        //         setTitle("Mastermind")
        //         break;
        // }

        setTitle(gameTitle)
    }, [gameTitle]); // Trigger effect when gameType changes

    return (

        <header>
            <h1 className="col-lg-8 mx-auto py-4 my-0 text-center">{title}</h1>
        </header>
    )
}

