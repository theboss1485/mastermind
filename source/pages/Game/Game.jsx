

import Instructions from '../Instructions/Instructions';
import './Game.css'
import React, { useState, useRef } from 'react';
import {Link} from 'react-router-dom';
import GameBoard from '../../components/GameBoard/GameBoardAndColorPicker';

export default function Game(props){

    const childRef = useRef();

    const [displayInstructions, setDisplayInstructions] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [colorCode, setColorCode] = useState([]);
    const [blackWhitePegs, setBlackWhitePegs] = useState(null);
    const [forceGameBoardUpdate, setForceGameBoardUpdate] = useState(false)

    

    const toggleInstructions = () => {

        if(displayInstructions){

            setDisplayInstructions(false);
        } else if (!displayInstructions){

            setDisplayInstructions(true)
        }
    }

    const handleGuess = async (guess, guessCounter) => {

        if(guess.includes('unset')){

            await childRef.current.flashCircles('darkred', guess);

        } else {

            let colorCodeCopy = [...colorCode]
            let guessCopy = [...guess]
    
            let correctColorCorrectPosition = 0;
            let correctColorIncorrectPosition = 0;
    
            for (let loopCounter1 = 0; loopCounter1 < colorCodeCopy.length; loopCounter1++){
    
                if(guessCopy[loopCounter1] === colorCodeCopy[loopCounter1]){
    
                    correctColorCorrectPosition++;
                    guessCopy[loopCounter1] = null;
                    colorCodeCopy[loopCounter1] = null;
    
                }
            }
    
            for (let loopCounter2 = 0; loopCounter2 < colorCodeCopy.length; loopCounter2++){
    
                if(guessCopy[loopCounter2] !== null){

                    let guessIndex = colorCodeCopy.indexOf(guessCopy[loopCounter2])
    
                    if(guessIndex !== -1){
    
                        correctColorIncorrectPosition++
                        guessCopy[loopCounter2] = null;
                        colorCodeCopy[guessIndex] = null;
        
                    }
                }
            }
    
            setBlackWhitePegs({correctColorCorrectPosition: correctColorCorrectPosition, correctColorIncorrectPosition: correctColorIncorrectPosition})

            if(correctColorCorrectPosition === 4){

                await childRef.current.flashCircles('green', null, true);
                childRef.current.drawActualCodeCircles(null, colorCode);

            } else if (guessCounter === 11 && correctColorCorrectPosition !== 4){

                await childRef.current.flashCircles('darkred', null, true);
                childRef.current.drawActualCodeCircles(null, colorCode);
            }
        }
    }

    const handleGameComplete = async () => {

        setGameComplete(true);
        setGameInProgress(false);
    }

    const playGame = () => {

        generateColorCode();
        setGameInProgress(true);
        if(gameComplete === true){
            setForceGameBoardUpdate(!forceGameBoardUpdate)
        }
        setGameComplete(false);
    }

    const quit = () => {

        setGameComplete(false);
    }

    const generateColorCode = () => {

         let generatedColorCode = [];

        for (let generatedColorCodeInteger = 0; generatedColorCodeInteger < 4; generatedColorCodeInteger++){

            let randomInteger = Math.floor(Math.random() * 6)

            switch(randomInteger){

                case 0:
                    generatedColorCode.push('blue');
                    break;
                case 1:
                    generatedColorCode.push('green');
                    break;
                case 2:
                    generatedColorCode.push('red');
                    break;
                case 3:
                    generatedColorCode.push('cyan');
                    break;
                case 4:
                    generatedColorCode.push('magenta');
                    break;
                case 5:
                    generatedColorCode.push('yellow');
                    break;
            }
        }

        setColorCode(generatedColorCode)
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
            {(gameInProgress || gameComplete) && (<GameBoard onGuess={handleGuess} onGameComplete={handleGameComplete} forceUpdate={forceGameBoardUpdate} calculatedGuessData={blackWhitePegs} ref={childRef} />)}
            {gameComplete && (
                <>
                    <div className='fit-content mx-auto my-2'>
                        <button onClick={playGame}>Play Again</button>
                    </div>
                    <div className='fit-content mx-auto my-2'>
                        <button onClick={quit}>Quit</button>
                    </div>
                </>
                
            )}
        </div>
    )
}