import React, { useRef, createContext, useContext, useImperativeHandle, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './GameBoardAndColorPicker.css'
import {gameBoardData} from './GameBoardData';
import playSound from '../../utilities/playSound';
const GameBoard = React.forwardRef(({onGuess, calculatedGuessData, onGameComplete, forceUpdate, colorCode, gameType, soundsOn}, ref) => {

    const yOffset = gameBoardData.yOffset[gameType]
    const canvasWidth = 300
    const numberOfGuesses = useSelector(state => state.static.numberOfGuesses[gameType]);
    const numberOfColors = useSelector(state => state.static.numberOfColors[gameType]);
    const numberOfHolesPerGuess = useSelector(state => state.static.numberOfHolesPerGuess[gameType]);
    const canvasHeight = yOffset + 
                         (gameBoardData.edgeGuessHoleMargin[gameType] * 2) +
                         (gameBoardData.guessHoleRadius[gameType] * 2) +
                         (gameBoardData.gapBetweenGuessHoleCenters[gameType] * (numberOfGuesses - 1)) + 30
    const lowPoppingSound = new Audio('../../../public/assets/sounds/lowPoppingSound.wav');
    const normalPoppingSound = new Audio('../../../public/assets/sounds/normalPoppingSound.wav');
    const highPoppingSound = new Audio('../../../public/assets/sounds/highPoppingSound.wav');
    const gameOverVictory = new Audio('../../../public/assets/sounds/gameOverVictory2.wav');
    const gameOverDefeat = new Audio('../../../public/assets/sounds/gameOverDefeat3.wav');

    const findScaleFactor = () => {

        let scaleFactor = 0;

        if(window.screen.width > canvasWidth * 2.15 && window.screen.height > canvasHeight * 2.15){
            
            scaleFactor = 1.5

        } else if (window.screen.width > canvasWidth * 1.5 && window.screen.height > canvasHeight * 1.5){

            scaleFactor = 1.25

        } else {

            scaleFactor = 1
        }

        return scaleFactor;
    }

    useEffect(() => {

        const handleResize = () => {
            
            setScaleFactor(findScaleFactor());
        };

        window.addEventListener('resize', handleResize);

        // // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array means this runs once on mount


    
    const [scaleFactor, setScaleFactor] = useState(null)

    const canvasReference = useRef(null);
    const [scaledCanvasWidth, setScaledCanvasWidth] = useState(null)
    const [scaledCanvasHeight, setScaledCanvasHeight] = useState(null) 
    const [largeRadius, setLargeRadius] = useState(null);
    const [clueHoleXIncrementValue, setClueHoleXIncrementValue] = useState(null);
    const [clueHoleXRow2ResetValue, setClueHoleXRow2ResetValue] = useState(null);
    const [clueHoleYIncrementValue1, setClueHoleYIncrementValue1] = useState(null);
    const [clueHoleYIncrementValue2, setClueHoleYIncrementValue2] = useState(null);
    const [colorPickerCircleRadius, setColorPickerCircleRadius] = useState(null); 
    const [edgeGuessHoleMargin, setEdgeGuessHoleMargin] = useState(null);
    const largeRadiusToGuessHoleXRatio = gameBoardData.largeRadiusToGuessHoleXRatio[gameType]
    const largeRadiusToGuessHoleYRatio = gameBoardData.largeRadiusToGuessHoleYRatio[gameType]
    const [clueHoleOffset, setClueHoleOffset] = useState(null);
    const [gapBetweenColorCircleCenters, setGapBetweenColorCircleCenters] = useState(null);
    const guessHoleCodeCircleNumber = gameBoardData.guessHoleCodeCircleNumber[gameType];
    const [edgeColorCircleMargin, setEdgeColorCircleMargin] = useState(null)
    const [questionMarkWidth, setQuestionMarkWidth] = useState(null)
    const [questionMarkHeight, setQestionMarkHeight] = useState(null);
    const [questionMarkYBaseValue1, setQuestionMarkBaseValue1] = useState(null);
    const [gapBetweenGuessHoleCenters, setGapBetweenGuessHoleCenters] = useState(null);
    const [changeGuessCounter, setChangeGuessCounter] = useState(false);
    const [questionMarkGlobalX, setQuestionMarkGlobalX] = useState(null);
    const [clickedGameHoleIndices, setClickedGameHoleIndices] = useState(null);
    const [clickedColorHoleIndices, setClickedColorHoleIndices] = useState(null);
    const [gameBoardCircleFillColor, setGameBoardCircleFillColor] = useState(null)
    const [questionMarksLoaded, setQuestionMarksLoaded] = useState(false);
    const [guessCounter, setGuessCounter] = useState(null)
    const [flashing, setFlashing] = useState(false)
    const [scaleFactorSet, setScaleFactorSet] = useState(false);
    const [playerGuess, setPlayerGuess] = useState(Array(numberOfHolesPerGuess).fill('black') );
    const [questionMarks] = useState([(() => {const image1 = new Image(); image1.src = '../../public/assets/images/black-question-mark.png'; return image1; })(),
                                       (() => {const image2 = new Image(); image2.src = '../../public/assets/images/gray-question-mark.png'; return image2;  })()
    ])

    const [firstCanvasUpdate, setFirstCanvasUpdate] = useState(true);

    const [gameData, setGameData] = useState([])

    const [canvasRendered, setCanvasRendered] = useState(false);

    useEffect(() => {

        setGameData([[Array(numberOfHolesPerGuess).fill('black'),[]]])
        
    }, [gameType, forceUpdate])

    useEffect(() => {

        if(gameData.length > 0){

            if((gameData.length === 1) & gameData[0][0].filter(item => item === 'black').length === numberOfHolesPerGuess){

                if(scaleFactorSet === false){

                    setScaleFactor(findScaleFactor());
                }
                
                if(questionMarksLoaded === false){
        
                    loadQuestionMarks(questionMarks);
                }

                setGuessCounter(0);
            }
        }

    }, [gameData])

    useEffect(() => {

        if(guessCounter === 0){

            renderEntireCanvas()
            setCanvasRendered(true)
        }
        

    }, [guessCounter])
    
    

    useEffect(() => {

        if(scaleFactor !== null){

            setGapBetweenGuessHoleCenters(gameBoardData.gapBetweenGuessHoleCenters[gameType] * scaleFactor);
            setQuestionMarkBaseValue1(gameBoardData.questionMarkYBaseValue1[gameType] * scaleFactor);
            setQestionMarkHeight(27 * scaleFactor);
            setQuestionMarkWidth(19 * scaleFactor);
            setEdgeColorCircleMargin(30 * scaleFactor);
            setGapBetweenColorCircleCenters(gameBoardData.gapBetweenColorCircleCenters[gameType] * scaleFactor);
            setClueHoleOffset(gameBoardData.clueHoleOffeset[gameType] * scaleFactor);
            setEdgeGuessHoleMargin(gameBoardData.edgeGuessHoleMargin[gameType] * scaleFactor);
            setColorPickerCircleRadius(gameBoardData.colorPickerCircleRadius[gameType] * scaleFactor);
            setClueHoleYIncrementValue2(gameBoardData.clueHoleYIncrementValue2[gameType] * scaleFactor);
            setClueHoleYIncrementValue1(gameBoardData.clueHoleYIncrementValue1[gameType] * scaleFactor);
            setClueHoleXRow2ResetValue(gameBoardData.clueHoleXRow2ResetValue[gameType] * scaleFactor);
            setClueHoleXIncrementValue(gameBoardData.clueHoleXIncrementValue[gameType] * scaleFactor);
            setLargeRadius(gameBoardData.guessHoleRadius[gameType] * scaleFactor);
            setScaledCanvasHeight(((canvasHeight - yOffset) * scaleFactor) + yOffset);
            setScaledCanvasWidth(canvasWidth * scaleFactor);
            setCanvasRendered(false);
        }

    }, [scaleFactor])

    const root = document.documentElement
    root.style.setProperty("--width-value", `${scaledCanvasWidth}px`)

    useImperativeHandle(ref, () => ({drawActualCodeCircles, flashCircles}));

    useEffect(() => {

        if(questionMarksLoaded  && scaledCanvasHeight && scaledCanvasWidth){
            renderEntireCanvas()
            setCanvasRendered(true)
        }
        
    }, [questionMarksLoaded]);

    useEffect(() => {

        if(canvasRendered === false && questionMarksLoaded){

            renderEntireCanvas();
            setCanvasRendered(true);
        }

    }, [canvasRendered]);

    useEffect(() => {

        if(clickedColorHoleIndices !== null){

            switch (clickedColorHoleIndices){

                case 0:
                    setGameBoardCircleFillColor('blue');
                    removeCursorClass();
                    document.body.classList.add('blue-cursor');
                    break;
                case 1:
                    setGameBoardCircleFillColor('green'); 
                    removeCursorClass();
                    document.body.classList.add('green-cursor');
                    break;
                case 2:
                    setGameBoardCircleFillColor('red');
                    removeCursorClass();
                    document.body.classList.add('red-cursor');
                    break;
                case 3:
                    setGameBoardCircleFillColor('cyan');
                    removeCursorClass();
                    document.body.classList.add('cyan-cursor');
                    break;
                case 4:
                    setGameBoardCircleFillColor('magenta');
                    removeCursorClass();
                    document.body.classList.add('magenta-cursor');
                    break;
                case 5:
                    setGameBoardCircleFillColor('yellow');
                    removeCursorClass();
                    document.body.classList.add('yellow-cursor');
                    break;
                case 6:
                    setGameBoardCircleFillColor('orange');
                    removeCursorClass();
                    document.body.classList.add('orange-cursor');
                    break;
                case 7:
                    setGameBoardCircleFillColor('purple');
                    removeCursorClass();
                    document.body.classList.add('purple-cursor');
                    break;
                default:
                    setGameBoardCircleFillColor('black');
                    removeCursorClass();
                    
            }

            const canvas = canvasReference.current;
            let ctx = canvas.getContext('2d');

            drawColorPicker(ctx);
        }

    }, [clickedColorHoleIndices])

    useEffect(() => {

        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        if(clickedGameHoleIndices !== null && clickedColorHoleIndices !== null && flashing === false){

            let centerX = (edgeGuessHoleMargin + (clickedGameHoleIndices[0] * gapBetweenGuessHoleCenters))
            let centerY = (edgeGuessHoleMargin + yOffset + (clickedGameHoleIndices[1] * gapBetweenGuessHoleCenters))

            drawSolidCircle(ctx, centerX, centerY, largeRadius, gameBoardCircleFillColor, true)
            setClickedGameHoleIndices(null)
        }

    }, [clickedGameHoleIndices]);

    useEffect(() => {

        updateCanvasAfterCompletedGuess()

    }, [calculatedGuessData])

    const drawSolidCircle = (ctx, centerX, centerY, radius, fillColor = 'gray', click = false) => {

        let fillStyle = null

        if(click === true){

            if(gameBoardCircleFillColor === "green"){

                fillStyle = "#00FF00"

            } else if(gameBoardCircleFillColor === "orange"){

                fillStyle = "#FF6600"


            } else {

                fillStyle = gameBoardCircleFillColor;
            }

        
        } else {

            fillStyle = fillColor
        }

        ctx.beginPath();
        ctx.fillStyle = fillStyle
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    const drawLargeCircleRowAndQuestionMark = (ctx, rowIndex, passedInGuessCounter, scaleFactorSet = false) => {

        let fillColor = "gray";

        for(let drawLargeCircles = 0; drawLargeCircles <= numberOfHolesPerGuess - 1; drawLargeCircles++){

            let centerXLarge = (edgeGuessHoleMargin + (drawLargeCircles * gapBetweenGuessHoleCenters  ));
            let centerYLarge = (edgeGuessHoleMargin + yOffset + (rowIndex * gapBetweenGuessHoleCenters));

            if(scaleFactorSet === true && gameData.length >= rowIndex){

                if(((gameData.length - 1) >= rowIndex) && Array.isArray(gameData[rowIndex][1])){

                    fillColor = gameData[rowIndex][0][drawLargeCircles];
                } 

                if(fillColor === "green"){

                    fillColor = "#00FF00"
                
                } else if (fillColor === "orange"){

                    fillColor = "#FF6600"
                }

                drawSolidCircle(ctx, centerXLarge, centerYLarge, largeRadius, fillColor)
                
            } else if(rowIndex === passedInGuessCounter){

                drawSolidCircle(ctx, centerXLarge, centerYLarge, largeRadius, 'black')

            } else {

                drawSolidCircle(ctx, centerXLarge, centerYLarge, largeRadius, 'gray')
            }

            if(drawLargeCircles === numberOfHolesPerGuess - 1){

                let questionMarkX = centerXLarge + largeRadius * largeRadiusToGuessHoleXRatio;
                let questionMarkY = centerYLarge - largeRadius * largeRadiusToGuessHoleYRatio;
                

                if(drawLargeCircles === (numberOfHolesPerGuess - 1) && rowIndex === guessCounter){

                    setQuestionMarkGlobalX(questionMarkX);
                }

                drawQuestionMark(ctx, rowIndex, passedInGuessCounter, questionMarkX, questionMarkY);
            }
        }
    }

    const drawQuestionMark = (ctx, rowIndex, passedInGuessCounter, questionMarkX, questionMarkY) =>{

        if(rowIndex === passedInGuessCounter){

            ctx.drawImage(questionMarks[0], questionMarkX, questionMarkY, questionMarkWidth, questionMarkHeight)
            // ctx.rect(questionMarkX, questionMarkY, questionMarkWidth, questionMarkHeight)
            // ctx.stroke();
        
        } else {

            ctx.drawImage(questionMarks[1], questionMarkX, questionMarkY, questionMarkWidth, questionMarkHeight)
        }
    }

    const drawFourSmallCircles = async (ctx, rowIndex, scaleFactorSet, fullRedraw, blackWhitePegs = null) => {

        let clueHoleCounter = 0

        let blackWhitePegData = []

        let centerXSmall = 250 * scaleFactor;
        let centerYSmall = (clueHoleOffset + yOffset) + (gapBetweenGuessHoleCenters * rowIndex);

        for(let drawSmallCirclesY = 0; drawSmallCirclesY <= 1; drawSmallCirclesY++){

            for (let drawSmallCirclesX = 0; drawSmallCirclesX < gameBoardData.clueHolesInFirstRow[gameType]; drawSmallCirclesX++){

                let fillColor = null;

                if(drawSmallCirclesY === 1 && drawSmallCirclesX === 0 && gameType === "super"){

                    continue;
                }

                let clueHoleRadius = gameBoardData.clueHoleRadius[gameType] * scaleFactor;

                if(blackWhitePegs !== null){

                    if(blackWhitePegs.correctColorCorrectPosition <= numberOfHolesPerGuess && blackWhitePegs.correctColorCorrectPosition > 0){

                        //drawSolidCircle(ctx, centerXSmall, centerYSmall, clueHoleRadius, 'black');
                        fillColor = 'black';
                        playSound(lowPoppingSound, soundsOn)
                        blackWhitePegData.push("black");

                        if (blackWhitePegs.correctColorCorrectPosition < numberOfHolesPerGuess){

                            blackWhitePegs.correctColorCorrectPosition--;
                        }

                    }  else if(blackWhitePegs.correctColorIncorrectPosition > 0){

                        //drawSolidCircle(ctx, centerXSmall, centerYSmall, clueHoleRadius, 'white');
                        fillColor = 'white';
                        playSound(highPoppingSound, soundsOn)
                        blackWhitePegs.correctColorIncorrectPosition--;
                        blackWhitePegData.push("white");
                    
                    } else {

                        blackWhitePegData.push("gray");
                    } 

                    if(fillColor !== null){
                        drawSolidCircle(ctx, centerXSmall, centerYSmall, clueHoleRadius, fillColor);
                        await sleep(250);
                    }

                } else if(scaleFactorSet === true && gameData.length > rowIndex + 1){


                    let fillColor = gameData[rowIndex][1][clueHoleCounter];
                    clueHoleCounter++

                    drawSolidCircle(ctx, centerXSmall, centerYSmall, clueHoleRadius, fillColor);

                } else {

                    drawSolidCircle(ctx, centerXSmall, centerYSmall, clueHoleRadius);
                }

                centerXSmall += clueHoleXIncrementValue
                
            }

            if(drawSmallCirclesY === 0){

                centerYSmall += clueHoleYIncrementValue1

            } else if(drawSmallCirclesY === 1){

                centerYSmall += clueHoleYIncrementValue2
            }

            centerXSmall = clueHoleXRow2ResetValue;
            
        }

        if(fullRedraw === false  && gameData.length > 0  && guessCounter !== numberOfGuesses){

            updateGameData([], blackWhitePegData)
        }
    }

    const drawColorPicker = (ctx) => {

        let fillStyle = null;

        for(let drawColorPickerCircleIndex = 0; drawColorPickerCircleIndex <= numberOfColors - 1; drawColorPickerCircleIndex++){

            let centerXLarge = (edgeColorCircleMargin + (drawColorPickerCircleIndex * gapBetweenColorCircleCenters));
            let centerYLarge = 40;

                switch(drawColorPickerCircleIndex){
    
                    case 0: 
                        fillStyle = 'blue';
                        break;
                    case 1: 
                        fillStyle = '#00FF00'; // neon green
                        break;
                    case 2: 
                        fillStyle = 'red';
                        break;
                    case 3: 
                        fillStyle = 'cyan';
                        break;
                    case 4: 
                        fillStyle = 'magenta';
                        break;
                    case 5: 
                        fillStyle = 'yellow';
                        break;
                    case 6:
                        fillStyle = '#FF6600' // a shade of orange
                        break;
                    case 7: 
                        fillStyle = 'purple'
                }
            
            drawSolidCircle(ctx, centerXLarge, centerYLarge, colorPickerCircleRadius, fillStyle)
        }

        if(clickedColorHoleIndices !== -1  && clickedColorHoleIndices !== null){

            let centerX = (edgeColorCircleMargin + (clickedColorHoleIndices * gapBetweenColorCircleCenters));
            let centerY = 40
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, colorPickerCircleRadius - (ctx.lineWidth * 0.45), 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    const removeCursorClass = () => {

        document.body.classList.forEach(className => {
            if (className.endsWith('cursor')) {
                document.body.classList.remove(className);
            }
        });
    }

    
    async function loadQuestionMarks(questionMarks) {
        console.log("question marks", questionMarks);
        let loadedQuestionMarks = 0;
    
        await Promise.all(questionMarks.map(questionMark => {
            
            return new Promise(resolve => {
                // Check if the image is already loaded
                if (questionMark.complete) {
                    loadedQuestionMarks++;
                    resolve();
                } else {
                    questionMark.onload = function () {
                        loadedQuestionMarks++;
                        resolve();
                    };
                }
            });
        }));
    
        if (loadedQuestionMarks === questionMarks.length) {
            setQuestionMarksLoaded(true);
        }
    }

    const canvasClicked = async (event) => {

        if(guessCounter < numberOfGuesses){

            const canvas = canvasReference.current;
            let ctx = canvas.getContext('2d');

            const canvasRect = canvas.getBoundingClientRect();
            const x = event.clientX - canvasRect.left;
            const y = event.clientY - canvasRect.top;

            // Check if the click is inside any of the large holes

            for(let colorHoleCounter = 0; colorHoleCounter <= numberOfColors - 1; colorHoleCounter++){

                const holeX = edgeColorCircleMargin + (colorHoleCounter % numberOfColors) * gapBetweenColorCircleCenters
                const holeY = 40

                if (Math.pow(x - holeX, 2) + Math.pow(y - holeY, 2) <= Math.pow(colorPickerCircleRadius, 2)) {

                    setClickedColorHoleIndices(colorHoleCounter);
                    playSound(normalPoppingSound, soundsOn);
                    break;
                }
            }

            for (let gameHoleCounter = 0; gameHoleCounter <= (numberOfHolesPerGuess - 1); gameHoleCounter++) {

                const holeX = edgeGuessHoleMargin + (gameHoleCounter * gapBetweenGuessHoleCenters);
                const holeY = yOffset + edgeGuessHoleMargin + (guessCounter * gapBetweenGuessHoleCenters);

                if ((Math.pow(x - holeX, 2) + Math.pow(y - holeY, 2) <= Math.pow(largeRadius, 2)) && flashing === false ) {

                    setClickedGameHoleIndices([gameHoleCounter, guessCounter]);

                    if(playerGuess[gameHoleCounter] !== gameBoardCircleFillColor){

                        playSound(normalPoppingSound, soundsOn);
                    }

                    if(gameBoardCircleFillColor !== null){

                        setPlayerGuess(() => {

                            let newColors = [...playerGuess];

                            newColors[gameHoleCounter] = gameBoardCircleFillColor
                            
                            updateGameData(newColors, ["none"])

                            return newColors
                        })
                    }
                }
            }

            let questionMarkY = guessCounter > 0 ? ((questionMarkYBaseValue1 + (gapBetweenGuessHoleCenters * guessCounter)) + yOffset) : (questionMarkYBaseValue1 + yOffset);
            let questionMarkX = questionMarkGlobalX;
            // ctx. fillColor = 'red'
            // ctx.beginPath(); // Start a new path
            // ctx.rect(questionMarkX, questionMarkY, questionMarkWidth, questionMarkHeight); // Add a rectangle to the current path
            // ctx.stroke(); // Render the path

            if((x >= questionMarkX) && (x <= (questionMarkX + questionMarkWidth)) && (y >= questionMarkY) && (y <= (questionMarkY + questionMarkHeight))){

                onGuess(playerGuess, guessCounter);
                if(playerGuess.includes('black') === false){
                    
                    playSound(normalPoppingSound, soundsOn);
                    
                    if(guessCounter <= (numberOfGuesses - 1)){

                        if(gameType === "super"){

                            setPlayerGuess(['black', 'black', 'black', 'black', 'black']);

                        } else {

                            setPlayerGuess(['black', 'black', 'black', 'black'])
                        }
                    }
                }
            }   
        }
    }

    const flashCircles = async (flashColor, guess = null, codeCircles = false) => {

        setFlashing(true)

        if(flashing === false){

            const canvas = canvasReference.current;
            let ctx = canvas.getContext('2d');

            for(let timerCounter = 0; timerCounter < (numberOfHolesPerGuess - 1); timerCounter++){

                if(codeCircles !== true){

                    for(let counter = 0; counter < guess.length; counter++){

                        if(guess[counter] === 'black'){
            
                            let centerX = (edgeGuessHoleMargin + (counter * gapBetweenGuessHoleCenters))
                            let centerY = (edgeGuessHoleMargin + yOffset + (guessCounter * gapBetweenGuessHoleCenters))
            
                            drawSolidCircle(ctx, centerX, centerY, largeRadius, flashColor);
                        }
                    }
                
                } else {

                    drawActualCodeCircles(flashColor);
                }

                await sleep(200);

                if(codeCircles !== true){

                    for(let counter2 = 0; counter2 < guess.length; counter2++){
        
                        if(guess[counter2] === 'black'){
            
                            let centerX = (edgeGuessHoleMargin + (counter2 * gapBetweenGuessHoleCenters));
                            let centerY = (edgeGuessHoleMargin + yOffset + (guessCounter * gapBetweenGuessHoleCenters));
            
                            drawSolidCircle(ctx, centerX, centerY, largeRadius, 'black');
                        }  
                    }

                } else {

                    drawActualCodeCircles('black')
                }
        
                await sleep(200);
            }

            setFlashing(false)
            
            if(codeCircles === true){

                drawActualCodeCircles(null, colorCode);
            }
        }
    }

    const updateGameData = (color, blackWhitePegs) => {

        let archive = false

        const updatedColor = color.length !== 0 ? color : gameData[guessCounter][0];
        const updatedBlackWhitePegs = blackWhitePegs[0] !== "none" ? blackWhitePegs : gameData[guessCounter][1];
    
        const newGameData = guessCounter === 0 
            ? [[updatedColor, updatedBlackWhitePegs]]
            : [
                ...gameData.slice(0, gameData.length - 1),
                [updatedColor,
                updatedBlackWhitePegs]
              ];

        if(blackWhitePegs[0] !== "none" && (guessCounter < numberOfGuesses - 1) && blackWhitePegs.filter(item => item === 'black').length < numberOfHolesPerGuess){

            newGameData.push([Array(numberOfHolesPerGuess).fill('black'), []]);
        }

        if((blackWhitePegs.filter(item => item === 'black').length === numberOfHolesPerGuess) || (guessCounter === numberOfGuesses - 1) && (blackWhitePegs[0] !== "none")){

            newGameData.push(colorCode);
            setGuessCounter(numberOfGuesses);
            setClickedColorHoleIndices(-1);
        }
        
        if(archive === false){

            setGameData(newGameData);
        }
    }

    const sleep = async (millisecondDelay) => {

        await new Promise(resolve => setTimeout(resolve, millisecondDelay));
    }

    const drawActualCodeCircles = async (flashColor = null, colorCode = null) => {

        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        let codeCircleX = ((scaledCanvasWidth / 2) - (guessHoleCodeCircleNumber * gapBetweenGuessHoleCenters))
        let codeCircleY = scaledCanvasHeight - edgeGuessHoleMargin

        for(let drawActualCodeCircles = 0; drawActualCodeCircles <= (numberOfHolesPerGuess - 1); drawActualCodeCircles++){

            if(colorCode){

                if(colorCode[drawActualCodeCircles] === 'green'){

                    drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, '#00FF00');

                } else if(colorCode[drawActualCodeCircles] === 'orange'){

                    drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, '#FF6600'); //#FF6600

                } else {

                    drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, colorCode[drawActualCodeCircles]);
                }

            } else {

                drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, flashColor);
            }

            

            codeCircleX += gapBetweenGuessHoleCenters;
        }
    }

    const renderEntireCanvas = async () => {

        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');
        
        canvas.width = scaledCanvasWidth
        canvas.height = scaledCanvasHeight
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgb(166, 90, 36)'); // light brown
        gradient.addColorStop(1, 'rgb(139, 69, 19)'); // dark brown
        ctx.fillStyle = gradient;
        ctx.roundRect(0, yOffset, scaledCanvasWidth, (scaledCanvasHeight - (yOffset)), 20);
        ctx.fill();

        ctx.roundRect(0, 0, scaledCanvasWidth, 80, 20);
        ctx.fill();

        drawColorPicker(ctx);

        for(let rowIndex = 0; rowIndex < numberOfGuesses; rowIndex++){

            drawLargeCircleRowAndQuestionMark(ctx, rowIndex, guessCounter, scaleFactorSet)

            await drawFourSmallCircles(ctx, rowIndex, scaleFactorSet, true);
        }

        if(gameData[gameData.length - 1].length === numberOfHolesPerGuess){

            drawActualCodeCircles(null, gameData[gameData.length - 1]);

        } else {

            drawActualCodeCircles()
        }

        
        setScaleFactorSet(true);
    }

    const updateCanvasAfterCompletedGuess = async () =>{

        let newGuessCounter = guessCounter + 1
        
        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        let questionMarkX = (edgeGuessHoleMargin + ((numberOfHolesPerGuess - 1) * gapBetweenGuessHoleCenters)) + largeRadius * largeRadiusToGuessHoleXRatio;
        let questionMarkY = (edgeGuessHoleMargin + yOffset + (guessCounter * gapBetweenGuessHoleCenters)) - largeRadius * largeRadiusToGuessHoleYRatio;

        drawQuestionMark(ctx, newGuessCounter, guessCounter, questionMarkX, questionMarkY);

        if(guessCounter < (numberOfGuesses - 1) && changeGuessCounter){

            if(calculatedGuessData.correctColorCorrectPosition !== numberOfHolesPerGuess){

                drawLargeCircleRowAndQuestionMark(ctx, newGuessCounter, newGuessCounter);
            }
        }

        if(firstCanvasUpdate === false && calculatedGuessData !== null){
            
            if(calculatedGuessData.correctColorCorrectPosition > 0 || calculatedGuessData.correctColorIncorrectPosition > 0){

                await sleep(500)
            }

        }
        

        await drawFourSmallCircles(ctx, guessCounter, false, false, calculatedGuessData);

        if(changeGuessCounter === true){

            if(calculatedGuessData.correctColorCorrectPosition !== numberOfHolesPerGuess){

                setGuessCounter(guessCounter + 1);
            }
        }

        if(calculatedGuessData){

            if(guessCounter === numberOfGuesses - 1 || calculatedGuessData.correctColorCorrectPosition === numberOfHolesPerGuess){

                onGameComplete();

                if(calculatedGuessData.correctColorCorrectPosition === numberOfHolesPerGuess){

                    flashCircles('green', null, true);
                    playSound(gameOverVictory, soundsOn);

                } else if(guessCounter === numberOfGuesses - 1){

                    flashCircles('darkred', null, true);
                    playSound(gameOverDefeat, soundsOn);
                }
            }
        }

        setChangeGuessCounter(true);

        if(firstCanvasUpdate === true){
            
            setFirstCanvasUpdate(false);
        }
    }

    return (

        <canvas className="my-3 centered" onClick={(playerGuess) => canvasClicked(playerGuess)} ref={canvasReference} width={scaledCanvasWidth} height={scaledCanvasHeight} />
    )
})

export default GameBoard