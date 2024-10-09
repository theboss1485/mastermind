

import Instructions from '../Instructions/Instructions';
import { useSelector, useDispatch } from 'react-redux';
import './Game.css'

import React, { useState, useRef, useEffect } from 'react';
import {Link} from 'react-router-dom';
import GameBoardAndColorPicker from '../../components/GameBoard/GameBoardAndColorPicker';
import { updateGameType } from '../../../store/reducers/slices/dynamicSlice';

export default function Game(props){

    const dispatch = useDispatch();

    const childRef = useRef();

    const [displayInstructions, setDisplayInstructions] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [colorCode, setColorCode] = useState([]);
    const [blackWhitePegs, setBlackWhitePegs] = useState(null);
    const gameType = useSelector(state => state.dynamic.gameTypeArray ? state.dynamic.gameTypeArray[0] : null);
    const [forceGameBoardUpdate, setForceGameBoardUpdate] = useState(false)
    const numberOfHolesPerGuessArray = useSelector(state => state.static.numberOfHolesPerGuess);
    const numberOfGuessesArray = useSelector(state => state.static.numberOfGuesses);
    const numberOfColorsArray = useSelector(state => state.static.numberOfColors);

    const gameTypeString = useSelector(state => state.dynamic.gameTypeArray ? state.dynamic.gameTypeArray[1] : "Mastermind");
    const gameTypebuttonClass = useSelector(state => state.dynamic.gameTypeArray ? state.dynamic.gameTypeArray[2] : null);

    useEffect(() => {

        setColorCode(generateColorCode());

    }, [gameType])

    const toggleInstructions = () => {

        if(displayInstructions){

            setDisplayInstructions(false);

        } else if (!displayInstructions){

            setDisplayInstructions(true);
        }
    }

    const handleGuess = async (guess, guessCounter) => {

        if(guess.includes('black')){

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

            if(correctColorCorrectPosition === numberOfHolesPerGuessArray[gameType]){

                await childRef.current.flashCircles('green', null, true);
                childRef.current.drawActualCodeCircles(null, colorCode);

            } else if (guessCounter === numberOfGuessesArray[gameType] - 1 && correctColorCorrectPosition !== numberOfHolesPerGuessArray[gameType]){

                await childRef.current.flashCircles('darkred', null, true);
                childRef.current.drawActualCodeCircles(null, colorCode);
            }
        }
    }

    const handleGameComplete = async () => {

        setGameComplete(true);
        setGameInProgress(false);
    }

    const playGame = async (gameTypeLocal) => {

        if(gameType === gameTypeLocal){

            setColorCode(generateColorCode());
        
        } else {

            dispatch(updateGameType(
            
                {
                    gameType: gameTypeLocal 
                }
            ))
        }

        setGameInProgress(true);

        if(gameComplete === true){

            setForceGameBoardUpdate(!forceGameBoardUpdate)
            
        }

        setGameComplete(false);
    }

    const quit = () => {

        dispatch(updateGameType(
            
            {
                gameType: "none"
            }
        ))

        setGameComplete(false);
        setGameInProgress(false);
    }

    const generateColorCode = () => {

         let generatedColorCode = [];

        for (let generatedColorCodeInteger = 0; generatedColorCodeInteger < numberOfHolesPerGuessArray[gameType]; generatedColorCodeInteger++){

            let randomInteger = Math.floor(Math.random() * numberOfColorsArray[gameType])

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
                case 6:
                    generatedColorCode.push('orange');
                    break;
                case 7:
                    generatedColorCode.push('purple');
                    break;
            }
        }

        return generatedColorCode
    }

    return (
        
        <div id="game-div">

            {(!displayInstructions && !gameInProgress && !gameComplete) && (

                <>
                    <div className='fit-content mx-auto py-2'>
                        <button className='btn btn-green' onClick={async () => {await playGame("regular")}}>Play Mastermind</button>
                    </div>
                    <div className='fit-content mx-auto py-2'>
                        <button className='btn btn-yellow' onClick={async () => {await playGame("super")}}>Play Super Mastermind</button>
                    </div>
                    <div className='fit-content mx-auto py-2'>
                        <button className='btn btn-red' onClick={async () => {await playGame("mini")}}>Play Mini Mastermind</button>
                    </div>
                    <div className='fit-content mx-auto py-2'>
                        <Link to="/instructions" onClick={toggleInstructions}>
                            <button className='btn btn-blue'>
                                Instructions
                            </button>
                        </Link>
                    </div>
                </>
            )}
            
            {displayInstructions && (<Instructions onBackButtonClick={toggleInstructions}/>)} 
            {(gameComplete || gameInProgress) && (
                <>
                    <GameBoardAndColorPicker 
                        gameType={gameType} 
                        colorCode={colorCode}
                        onGuess={handleGuess} 
                        onGameComplete={handleGameComplete} 
                        forceUpdate={forceGameBoardUpdate} 
                        calculatedGuessData={blackWhitePegs} 
                        ref={childRef} />
                </>     
            )}

            {gameComplete && (
                <div className='fit-content mx-auto py-2'>
                    <button className={gameTypebuttonClass} onClick={async () => {await playGame(gameType)}}>Play {gameTypeString} Again</button>
                </div>
            )}

            {(gameComplete || gameInProgress) && (

                <div className='fit-content mx-auto py-2'>
                    <button className='btn btn-bright-red' onClick={quit}>Quit</button>
                </div> 
            )}  
                
        </div>
    )
}