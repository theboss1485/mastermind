

import Instructions from '../Instructions/Instructions';
import './Game.css'
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import GameBoard from '../../components/GameBoard/GameBoardAndColorPicker';

export default function Game(props){

    const [displayInstructions, setDisplayInstructions] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);

    

    const toggleInstructions = () => {

        if(displayInstructions){

            setDisplayInstructions(false);
        } else if (!displayInstructions){

            setDisplayInstructions(true)
        }
    }

    const playGame = () => {

        setGameInProgress(true)
    }



    return (
        

        <div id="game-div">

            {(!displayInstructions && !gameInProgress) && (

                <>
                    <div className='fit-content mx-auto my-2'>
                        <button onClick={playGame}>Play</button>
                    </div>
                    <div className='fit-content mx-auto my-2'>
                        <Link to="/instructions" onClick={toggleInstructions}>
                            <button>
                                Instructions
                            </button>
                        </Link>
                    </div>
                </>

            )}
            {displayInstructions && (<Instructions onBackButtonClick={toggleInstructions}/>)} 
            {gameInProgress && (<GameBoard />)} 
        </div>
    )
}