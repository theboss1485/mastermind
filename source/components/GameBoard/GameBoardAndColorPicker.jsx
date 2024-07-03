import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import './GameBoardAndColorPicker.css'
const GameBoard = React.forwardRef(({onGuess, calculatedGuessData, onGameComplete, forceUpdate}, ref) => {

    const canvasReference = useRef(null);
    const yOffset = 90
    const canvasWidth = 300;
    const canvasHeight = 700 + yOffset;
    const largeRadius = 20;
    const colorPickerCircleRadius = 19
    const questionMarkWidth = 19;
    const questionMarkHeight = 27;
    const questionMarkHeightOffset = Math.round((questionMarkHeight * 2) / 27);
    const [changeGuessCounter, setChangeGuessCounter] = useState(false);
    const [questionMarkGlobalX, setQuestionMarkGlobalX] = useState(null);
    const [questionMarkYBaseValue, setQuestionMarkYBaseValue] = useState(null);
    const [clickedGameHoleIndices, setClickedGameHoleIndices] = useState(null);
    const [clickedColorHoleIndices, setClickedColorHoleIndices] = useState(null);
    const [gameBoardCircleFillColor, setGameBoardCircleFillColor] = useState(null)
    const [questionMarksLoaded, setQuestionMarksLoaded] = useState(false);
    const [guessCounter, setGuessCounter] = useState(0)
    const [flashing, setFlashing] = useState(false)
    const [playerGuess, setPlayerGuess] = useState(['unset', 'unset', 'unset', 'unset'])
    const [questionMarks] = useState([(() => {const image1 = new Image(); image1.src = '../../public/assets/images/black-question-mark.png'; return image1; })(),
                                      (() => {const image2 = new Image(); image2.src = '../../public/assets/images/gray-question-mark.png'; return image2;})()
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

        for(let rowIndex = 0; rowIndex <= 11; rowIndex++){

            drawLargeCircleRowAndQuestionMark(ctx, rowIndex, guessCounter)

            drawFourSmallCircles(ctx, rowIndex);
        }

        drawActualCodeCircles();

    }, [questionMarksLoaded, forceUpdate]);

    useEffect(() => {

        if(clickedColorHoleIndices !== null){

            switch (clickedColorHoleIndices){

                case 0:
                    setGameBoardCircleFillColor('blue');
                    removeCursorClass();
                    document.body.classList.add('blue-cursor');
                    break;
                case 1:
                    setGameBoardCircleFillColor('#00FF00');
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
            }

            const canvas = canvasReference.current;
            let ctx = canvas.getContext('2d');
            // ctx.lineWidth = 5;

            drawColorPicker(ctx);

            let centerX = (30 + (clickedColorHoleIndices * 48));
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

            let centerX = (40 + (clickedGameHoleIndices[0] * 50))
            let centerY = (40 + yOffset + (clickedGameHoleIndices[1] * 50))

            drawSolidCircle(ctx, centerX, centerY, largeRadius, gameBoardCircleFillColor, true)
            setClickedGameHoleIndices(null)
        }

    }, [clickedGameHoleIndices]);

    useEffect(() => {

        let newGuessCounter = guessCounter + 1
        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        let questionMarkX =  (40 + (3 * 50)) + largeRadius * 1.30;
        let questionMarkY = (40 + yOffset + (guessCounter * 50)) - largeRadius * 0.75;

        drawFourSmallCircles(ctx, guessCounter, calculatedGuessData);
        drawQuestionMark(ctx, newGuessCounter, guessCounter, questionMarkX, questionMarkY);

        if(guessCounter < 11 && changeGuessCounter){

            if(calculatedGuessData.correctColorCorrectPosition !== 4){

                drawLargeCircleRowAndQuestionMark(ctx, newGuessCounter, newGuessCounter);
            }
            
        }



        if(changeGuessCounter === true){

            if(calculatedGuessData.correctColorCorrectPosition !== 4){

                setGuessCounter(guessCounter + 1);
            }
            
        }

        if(calculatedGuessData){

            if(guessCounter === 11 || calculatedGuessData.correctColorCorrectPosition){
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

        for(let drawLargeCircles = 0; drawLargeCircles <= 3; drawLargeCircles++){

            let centerXLarge = (40 + (drawLargeCircles * 50));
            let centerYLarge = (40 + yOffset + (rowIndex * 50));

            if(rowIndex === passedInGuessCounter){

                drawSolidCircle(ctx, centerXLarge, centerYLarge, largeRadius, 'black')

            } else {

                drawSolidCircle(ctx, centerXLarge, centerYLarge, largeRadius, 'gray')
            }

            

            if(drawLargeCircles === 3){

                let questionMarkX = centerXLarge + largeRadius * 1.30;
                let questionMarkY = centerYLarge - largeRadius * 0.75;
                

                if(drawLargeCircles === 3 && rowIndex === guessCounter && questionMarkGlobalX === null && questionMarkYBaseValue == null){

                    setQuestionMarkGlobalX(questionMarkX);
                    setQuestionMarkYBaseValue(questionMarkY - yOffset);
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
        let centerYSmall = (27 + yOffset) + (50 * rowIndex);

        for(let drawSmallCirclesY = 0; drawSmallCirclesY <= 1; drawSmallCirclesY++){

            for (let drawSmallCirclesX = 0; drawSmallCirclesX <= 1; drawSmallCirclesX++){

                let smallRadius = 7;

                if(blackWhitePegs !== null){

                    if(blackWhitePegs.correctColorCorrectPosition < 4 && blackWhitePegs.correctColorCorrectPosition > 0){

                        drawSolidCircle(ctx, centerXSmall, centerYSmall, smallRadius, 'black');
                        blackWhitePegs.correctColorCorrectPosition--;

                    } else if (blackWhitePegs.correctColorCorrectPosition === 4){

                        drawSolidCircle(ctx, centerXSmall, centerYSmall, smallRadius, 'black');
                    } 
                    
                    else if(blackWhitePegs.correctColorIncorrectPosition > 0){

                        drawSolidCircle(ctx, centerXSmall, centerYSmall, smallRadius, 'white');
                        blackWhitePegs.correctColorIncorrectPosition--;
                    }

                } else {

                    drawSolidCircle(ctx, centerXSmall, centerYSmall, smallRadius);
                }

                centerXSmall += 26;
            }

            if(drawSmallCirclesY === 0){

                centerYSmall += 26

            } else if(drawSmallCirclesY === 1){

                centerYSmall += 24
            }

            centerXSmall = 250;
            
        }
    }

    const drawColorPicker = (ctx) => {

        let fillStyle = null;

        for(let drawColorPickerCircleIndex = 0; drawColorPickerCircleIndex <= 5; drawColorPickerCircleIndex++){

            let centerXLarge = (30 + (drawColorPickerCircleIndex * 48));
            let centerYLarge = 40;

                switch(drawColorPickerCircleIndex){
    
                    case 0: 
                        fillStyle = 'blue';
                        break;
                    case 1: 
                        fillStyle = '#00FF00';
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

        for(let colorHoleCounter = 0; colorHoleCounter < 6; colorHoleCounter++){

            const holeX = 30 + (colorHoleCounter % 6) * 48
            const holeY = 40

            if (Math.pow(x - holeX, 2) + Math.pow(y - holeY, 2) <= Math.pow(colorPickerCircleRadius, 2)) {

                setClickedColorHoleIndices(colorHoleCounter);
                break;
            }
        }

        for (let gameHoleCounter = 0; gameHoleCounter < 4; gameHoleCounter++) {

            const holeX = 40 + (gameHoleCounter * 50);
            const holeY = yOffset + 40 + (guessCounter * 50);

            if ((Math.pow(x - holeX, 2) + Math.pow(y - holeY, 2) <= Math.pow(largeRadius, 2)) && flashing === false ) {

                setClickedGameHoleIndices([gameHoleCounter, guessCounter]);
                setPlayerGuess(previousColors => {

                    let newColors = [...previousColors];

                    newColors[gameHoleCounter] = gameBoardCircleFillColor === '#00FF00' ? 'green': gameBoardCircleFillColor
                    
                    return newColors
                })
            }
        }



        let questionMarkY = guessCounter > 0 ? ((questionMarkYBaseValue * (guessCounter + 1)) + ((questionMarkHeight - questionMarkHeightOffset) * guessCounter) + yOffset) : (questionMarkYBaseValue + yOffset);
        let questionMarkX = questionMarkGlobalX;
        

        if((x >= questionMarkX) && (x <= (questionMarkX + questionMarkWidth)) && (y >= questionMarkY) && (y <= (questionMarkY + questionMarkHeight))){

            onGuess(playerGuess, guessCounter);
            if(playerGuess.includes('unset') === false && guessCounter < 11){

                setPlayerGuess(['unset', 'unset', 'unset', 'unset']);
            }
            
        }
    };

    const flashCircles = async (flashColor, guess = null, codeCircles = false) => {

        setFlashing(true)

        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        for(let timerCounter = 0; timerCounter < 3; timerCounter++){

            if(codeCircles !== true){

                for(let counter = 0; counter < guess.length; counter++){

                    if(guess[counter] === 'unset'){
        
                        let centerX = (40 + (counter * 50))
                        let centerY = (40 + yOffset + (guessCounter * 50))
        
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
        
                        let centerX = (40 + (counter2 * 50));
                        let centerY = (40 + yOffset + (guessCounter * 50));
        
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

        let codeCircleX = ((canvasWidth / 2) - (3.5 * largeRadius))
        let codeCircleY = canvasHeight - 35

        for(let drawActualCodeCircles = 0; drawActualCodeCircles <= 3; drawActualCodeCircles++){

            if(colorCode){

                if(colorCode[drawActualCodeCircles] === 'green'){

                    drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, '#00FF00');
                
                } else {

                    drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, colorCode[drawActualCodeCircles]);
                }

            } else {

                drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius, flashColor);
            }

            

            codeCircleX += 50;
        }
    }

    // const resetGuessCounter = async () => {

    //     await new Promise(resolve => {
    //         setGuessCounter(0)
    //         resolve()
    //     });
        
    // }

    loadQuestionMarks(questionMarks);

    return (

        <canvas className="my-3 centered" onClick={(playerGuess) => canvasClicked(playerGuess)} ref={canvasReference} width={canvasWidth} height={canvasHeight} />
    )
})

export default GameBoard