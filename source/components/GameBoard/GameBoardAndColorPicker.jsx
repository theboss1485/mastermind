import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './GameBoardAndColorPicker.css'
import {gameBoardData} from './GameBoardData';
const GameBoard = React.forwardRef(({onGuess, calculatedGuessData, onGameComplete, forceUpdate, gameType}, ref) => {

    const numberOfGuesses = useSelector(state => state.numberOfGuesses[gameType]);
    const numberOfColors = useSelector(state => state.numberOfColors[gameType]);
    const numberOfHolesPerGuess = useSelector(state => state.numberOfHolesPerGuess[gameType]);
    const canvasReference = useRef(null);
    const yOffset = gameBoardData.yOffset[gameType]
    const canvasWidth = 300;
    const canvasHeight = gameBoardData.canvasHeight[gameType] + yOffset;
    const largeRadius = gameBoardData.guessHoleRadius[gameType];
    const clueHoleXIncrementValue = gameBoardData.clueHoleXIncrementValue[gameType]
    const clueHoleXRow2ResetValue = gameBoardData.clueHoleXRow2ResetValue[gameType]
    const clueHoleYIncrementValue1 = gameBoardData.clueHoleYIncrementValue1[gameType]
    const clueHoleYIncrementValue2 = gameBoardData.clueHoleYIncrementValue2[gameType]
    const colorPickerCircleRadius = gameBoardData.colorPickerCircleRadius[gameType];
    const edgeGuessHoleMargin = gameBoardData.edgeGuessHoleMargin[gameType];
    const largeRadiusToGuessHoleXRatio = gameBoardData.largeRadiusToGuessHoleXRatio[gameType]
    const largeRadiusToGuessHoleYRatio = gameBoardData.largeRadiusToGuessHoleYRatio[gameType]
    const clueHoleOffset = gameBoardData.clueHoleOffeset[gameType]
    const gapBetweenColorCircleCenters = gameBoardData.gapBetweenColorCircleCenters[gameType]
    const guessHoleCodeCircleNumber = gameBoardData.guessHoleCodeCircleNumber[gameType]
    const edgeColorCircleMargin = 27.5
    const questionMarkWidth = 19;
    const questionMarkHeight = 27;
    const questionMarkYBaseValue1 = gameBoardData.questionMarkYBaseValue1[gameType]
    const questionMarkYBaseValue2 = gameBoardData.questionMarkYBaseValue2[gameType]
    const questionMarkHeightOffset = Math.round((questionMarkHeight * 2) / 27);
    const gapBetweenGuessHoleCenters = gameBoardData.gapBetweenGuessHoleCenters[gameType]
    const [changeGuessCounter, setChangeGuessCounter] = useState(false);
    const [questionMarkGlobalX, setQuestionMarkGlobalX] = useState(null);
    const [clickedGameHoleIndices, setClickedGameHoleIndices] = useState(null);
    const [clickedColorHoleIndices, setClickedColorHoleIndices] = useState(null);
    const [gameBoardCircleFillColor, setGameBoardCircleFillColor] = useState(null)
    const [questionMarksLoaded, setQuestionMarksLoaded] = useState(false);
    const [guessCounter, setGuessCounter] = useState(0)
    const [flashing, setFlashing] = useState(false)
    const [playerGuess, setPlayerGuess] = useState(gameType === 'super' ? Array(5).fill('unset') : Array(4).fill('unset'));
    const [questionMarks] = useState([(() => {const image1 = new Image(); image1.src = '../../public/assets/images/black-question-mark.png'; return image1; })(),
                                      (() => {const image2 = new Image(); image2.src = '../../public/assets/images/gray-question-mark.png'; return image2;  })()
    ])

    useImperativeHandle(ref, () => ({flashCircles, drawActualCodeCircles}));

    useEffect(() => {
        
        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');
        

        // Use ctx to draw on the canvas
        

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgb(166, 90, 36)'); // light brown
        gradient.addColorStop(1, 'rgb(139, 69, 19)'); // dark brown
        ctx.fillStyle = gradient;
        ctx.roundRect(0, yOffset, canvasWidth, canvasHeight - yOffset, 20);
        ctx.fill();

        ctx.roundRect(0, 0, canvasWidth, 80, 20);
        ctx.fill();

        drawColorPicker(ctx);

        for(let rowIndex = 0; rowIndex < numberOfGuesses; rowIndex++){

            drawLargeCircleRowAndQuestionMark(ctx, rowIndex, guessCounter)

            drawFourSmallCircles(ctx, rowIndex);
        }

        drawActualCodeCircles();

    }, [questionMarksLoaded, forceUpdate, gameType]);

    useEffect(() => {

        if(clickedColorHoleIndices !== null){

            switch (clickedColorHoleIndices){

                case 0:
                    setGameBoardCircleFillColor('blue');
                    removeCursorClass();
                    document.body.classList.add('blue-cursor');
                    break;
                case 1:
                    setGameBoardCircleFillColor('#00FF00'); //neon green
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
                    setGameBoardCircleFillColor('#FF6600') //an orangier shade of orange than the CSS color orange
                    removeCursorClass();
                    document.body.classList.add('orange-cursor');
                    break;
                case 7:
                    setGameBoardCircleFillColor('purple')
                    removeCursorClass();
                    document.body.classList.add('purple-cursor');
                    break;
            }

            const canvas = canvasReference.current;
            let ctx = canvas.getContext('2d');
            // ctx.lineWidth = 5;

            drawColorPicker(ctx);

            let centerX = (edgeColorCircleMargin + (clickedColorHoleIndices * gapBetweenColorCircleCenters));
            let centerY = 40
            ctx.lineWidth = 3;

            ctx.beginPath();
            
            ctx.arc(centerX, centerY, colorPickerCircleRadius - (ctx.lineWidth * 0.45), 0, 2 * Math.PI);
            ctx.stroke();
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

        let newGuessCounter = guessCounter + 1
        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        let questionMarkX = (edgeGuessHoleMargin + ((numberOfHolesPerGuess - 1) * gapBetweenGuessHoleCenters)) + largeRadius * largeRadiusToGuessHoleXRatio;
        let questionMarkY = (edgeGuessHoleMargin + yOffset + (guessCounter * gapBetweenGuessHoleCenters)) - largeRadius * largeRadiusToGuessHoleYRatio;

        drawFourSmallCircles(ctx, guessCounter, calculatedGuessData);
        drawQuestionMark(ctx, newGuessCounter, guessCounter, questionMarkX, questionMarkY);

        if(guessCounter < (numberOfGuesses - 1) && changeGuessCounter){

            if(calculatedGuessData.correctColorCorrectPosition !== numberOfHolesPerGuess){

                drawLargeCircleRowAndQuestionMark(ctx, newGuessCounter, newGuessCounter);
            }
            
        }



        if(changeGuessCounter === true){

            if(calculatedGuessData.correctColorCorrectPosition !== numberOfHolesPerGuess){

                setGuessCounter(guessCounter + 1);
            }
            
        }

        if(calculatedGuessData){

            if(guessCounter === numberOfGuesses - 1 || calculatedGuessData.correctColorCorrectPosition === numberOfHolesPerGuess){

                setGuessCounter(0);
                onGameComplete();
            }
        }

        setChangeGuessCounter(true);

    }, [calculatedGuessData])



    const drawSolidCircle = (ctx, centerX, centerY, radius, fillColor = 'gray', click = false) => {

        let fillStyle = null

        if(click === true){

            fillStyle = gameBoardCircleFillColor;
        
        } else {

            fillStyle = fillColor
        }

        ctx.beginPath();
        ctx.fillStyle = fillStyle
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    const drawLargeCircleRowAndQuestionMark = (ctx, rowIndex, passedInGuessCounter) => {

        for(let drawLargeCircles = 0; drawLargeCircles <= numberOfHolesPerGuess - 1; drawLargeCircles++){

            let centerXLarge = (edgeGuessHoleMargin + (drawLargeCircles * gapBetweenGuessHoleCenters  ));
            let centerYLarge = (edgeGuessHoleMargin + yOffset + (rowIndex * gapBetweenGuessHoleCenters));

            if(rowIndex === passedInGuessCounter){

                drawSolidCircle(ctx, centerXLarge, centerYLarge, largeRadius, 'black')

            } else {

                drawSolidCircle(ctx, centerXLarge, centerYLarge, largeRadius, 'gray')
            }

            

            if(drawLargeCircles === numberOfHolesPerGuess - 1){

                let questionMarkX = centerXLarge + largeRadius * largeRadiusToGuessHoleXRatio;
                let questionMarkY = centerYLarge - largeRadius * largeRadiusToGuessHoleYRatio;
                

                if(drawLargeCircles === (numberOfHolesPerGuess - 1) && rowIndex === guessCounter && questionMarkGlobalX === null){

                    setQuestionMarkGlobalX(questionMarkX);
                    //setQuestionMarkYBaseValue(questionMarkY - yOffset);
                }

                drawQuestionMark(ctx, rowIndex, passedInGuessCounter, questionMarkX, questionMarkY);
            }
        }
    }

    const drawQuestionMark = (ctx, rowIndex, passedInGuessCounter, questionMarkX, questionMarkY) =>{

        if(rowIndex === passedInGuessCounter){

            ctx.drawImage(questionMarks[0], questionMarkX, questionMarkY)
        
        } else {

            ctx.drawImage(questionMarks[1], questionMarkX, questionMarkY)
        }
    }

    const drawFourSmallCircles = (ctx, rowIndex, blackWhitePegs = null) => {

        let centerXSmall = 250;
        let centerYSmall = (clueHoleOffset + yOffset) + (gapBetweenGuessHoleCenters * rowIndex);

        for(let drawSmallCirclesY = 0; drawSmallCirclesY <= 1; drawSmallCirclesY++){

            for (let drawSmallCirclesX = 0; drawSmallCirclesX < gameBoardData.clueHolesInFirstRow[gameType]; drawSmallCirclesX++){

                if(drawSmallCirclesY === 1 && drawSmallCirclesX === 0 && gameType === "super"){

                    continue;
                }

                let clueHoleRadius = gameBoardData.clueHoleRadius[gameType];

                if(blackWhitePegs !== null){

                    if(blackWhitePegs.correctColorCorrectPosition < numberOfHolesPerGuess && blackWhitePegs.correctColorCorrectPosition > 0){

                        drawSolidCircle(ctx, centerXSmall, centerYSmall, clueHoleRadius, 'black');
                        blackWhitePegs.correctColorCorrectPosition--;

                    } else if (blackWhitePegs.correctColorCorrectPosition === numberOfHolesPerGuess){

                        drawSolidCircle(ctx, centerXSmall, centerYSmall, clueHoleRadius, 'black');
                    } 
                    
                    else if(blackWhitePegs.correctColorIncorrectPosition > 0){

                        drawSolidCircle(ctx, centerXSmall, centerYSmall, clueHoleRadius, 'white');
                        blackWhitePegs.correctColorIncorrectPosition--;
                    }

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
                questionMark.onload = function () {
                    loadedQuestionMarks++;
                    resolve();
                };
            });
        }));
    
        if (loadedQuestionMarks === questionMarks.length) {
            setQuestionMarksLoaded(true);
        }
    }

    const canvasClicked = (event) => {

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
                break;
            }
        }

        for (let gameHoleCounter = 0; gameHoleCounter <= (numberOfHolesPerGuess - 1); gameHoleCounter++) {

            const holeX = edgeGuessHoleMargin + (gameHoleCounter * gapBetweenGuessHoleCenters);
            const holeY = yOffset + edgeGuessHoleMargin + (guessCounter * gapBetweenGuessHoleCenters);

            if ((Math.pow(x - holeX, 2) + Math.pow(y - holeY, 2) <= Math.pow(largeRadius, 2)) && flashing === false ) {

                setClickedGameHoleIndices([gameHoleCounter, guessCounter]);

                if(gameBoardCircleFillColor !== null){

                    setPlayerGuess(previousColors => {

                        let newColors = [...previousColors];
    
                        newColors[gameHoleCounter] = gameBoardCircleFillColor === '#00FF00' ? 'green': gameBoardCircleFillColor
                        
                        return newColors
                    })
                }
            }
        }



        let questionMarkY = guessCounter > 0 ? ((questionMarkYBaseValue1 + (questionMarkYBaseValue2 * guessCounter)) + ((questionMarkHeight - questionMarkHeightOffset) * guessCounter) + yOffset) : (questionMarkYBaseValue1 + yOffset);
        let questionMarkX = questionMarkGlobalX;
        ctx. fillColor = 'red'
        ctx.beginPath(); // Start a new path
        ctx.rect(questionMarkX, questionMarkY, questionMarkWidth, questionMarkHeight); // Add a rectangle to the current path
        ctx.stroke(); // Render the path

        if((x >= questionMarkX) && (x <= (questionMarkX + questionMarkWidth)) && (y >= questionMarkY) && (y <= (questionMarkY + questionMarkHeight))){

            onGuess(playerGuess, guessCounter);
            if(playerGuess.includes('unset') === false && guessCounter < 11){

                if(gameType === "super"){

                    setPlayerGuess(['unset', 'unset', 'unset', 'unset', 'unset']);

                } else {

                    setPlayerGuess(['unset', 'unset', 'unset', 'unset'])
                }
            }
        }
    };

    const flashCircles = async (flashColor, guess = null, codeCircles = false) => {

        setFlashing(true)

        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        for(let timerCounter = 0; timerCounter < (numberOfHolesPerGuess - 1); timerCounter++){

            if(codeCircles !== true){

                for(let counter = 0; counter < guess.length; counter++){

                    if(guess[counter] === 'unset'){
        
                        let centerX = (edgeGuessHoleMargin + (counter * gapBetweenGuessHoleCenters))
                        let centerY = (edgeGuessHoleMargin + yOffset + (guessCounter * gapBetweenGuessHoleCenters))
        
                        drawSolidCircle(ctx, centerX, centerY, largeRadius, flashColor);
                        
                    }
                }
            
            } else {

                drawActualCodeCircles(flashColor)
            }

            await sleep(200);

            if(codeCircles !== true){

                for(let counter2 = 0; counter2 < guess.length; counter2++){
    
                    if(guess[counter2] === 'unset'){
        
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
    }

    const sleep = async (millisecondDelay) => {

        await new Promise(resolve => setTimeout(resolve, millisecondDelay));
    }

    const drawActualCodeCircles = async (flashColor = null, colorCode = null) => {

        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        let codeCircleX = ((canvasWidth / 2) - (guessHoleCodeCircleNumber * gapBetweenGuessHoleCenters))
        let codeCircleY = canvasHeight - 35

        for(let drawActualCodeCircles = 0; drawActualCodeCircles <= (numberOfHolesPerGuess - 1); drawActualCodeCircles++){

            if(colorCode){

                if(colorCode[drawActualCodeCircles] === 'green'){

                    drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, '#00FF00');
                
                } else {

                    drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, colorCode[drawActualCodeCircles]);
                }

            } else {

                drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, flashColor);
            }

            

            codeCircleX += gapBetweenGuessHoleCenters;
        }
    }

    loadQuestionMarks(questionMarks);

    return (

        <canvas className="my-3 centered" onClick={(playerGuess) => canvasClicked(playerGuess)} ref={canvasReference} width={canvasWidth} height={canvasHeight} />
    )
})

export default GameBoard