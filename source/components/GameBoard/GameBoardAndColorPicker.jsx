import React, { useRef, useEffect, useState } from 'react';
import './GameBoardAndColorPicker.css'
export default function GameBoard(){

    const canvasReference = useRef(null);
    const yOffset = 90
    const canvasWidth = 300;
    const canvasHeight = 700 + yOffset;
    
    const largeRadius = 20;
    const colorPickerCircleRadius = 19

    const [clickedGameHoleIndices, setClickedGameHoleIndices] = useState(null);
    const [clickedColorHoleIndices, setClickedColorHoleIndices] = useState(null);
    const [gameBoardCircleFillColor, setGameBoardCircleFillColor] = useState(null)

    useEffect(() => {
        
        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        // Use ctx to draw on the canvas
        canvas.addEventListener('click', (event) => {

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
    
            // Check if the click is inside any of the large holes

            for(let colorHoleCounter = 0; colorHoleCounter < 6; colorHoleCounter++){

                const holeX = 30 + (colorHoleCounter % 6) * 48
                const holeY = 40

                if (Math.pow(x - holeX, 2) + Math.pow(y - holeY, 2) <= Math.pow(colorPickerCircleRadius, 2)) {

                    setClickedColorHoleIndices(colorHoleCounter);
                    break;
                }
            }

            for (let gameHoleCounter = 0; gameHoleCounter < 48; gameHoleCounter++) {

                const holeX = 40 + (gameHoleCounter % 4) * 50;
                const holeY = yOffset+ 40 + Math.floor(gameHoleCounter / 4) * 50;

                if (Math.pow(x - holeX, 2) + Math.pow(y - holeY, 2) <= Math.pow(largeRadius, 2)) {

                    setClickedGameHoleIndices([(gameHoleCounter % 4), (Math.floor(gameHoleCounter / 4))]);
                    break;
                }
            }
        });

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgb(166, 90, 36)'); // light brown
        gradient.addColorStop(1, 'rgb(139, 69, 19)'); // dark brown
        ctx.fillStyle = gradient;
        ctx.roundRect(0, yOffset, canvasWidth, canvasHeight - yOffset, 20);
        ctx.fill();

        ctx.roundRect(0, 0, canvasWidth, 80, 20);
        ctx.fill();

        let centerXSmall = 250;
        let centerYSmall = 27 + yOffset;

        drawColorPicker(ctx);

        for(let rowIndex = 0; rowIndex <= 11; rowIndex++){

            for(let drawLargeCircles = 0; drawLargeCircles <= 3; drawLargeCircles++){

                let centerXLarge = (40 + (drawLargeCircles * 50));
                let centerYLarge = (40 + yOffset + (rowIndex * 50));
    
                drawSolidCircle(ctx, centerXLarge, centerYLarge, largeRadius)
            }

            for(let drawSmallCirclesY = 0; drawSmallCirclesY <= 1; drawSmallCirclesY++){

                for (let drawSmallCirclesX = 0; drawSmallCirclesX <= 1; drawSmallCirclesX++){

                    let smallRadius = 7

                    drawSolidCircle(ctx, centerXSmall, centerYSmall, smallRadius)

                    
                    ctx.beginPath();
                    ctx.fillStyle = 'gray';
                    ctx.arc(centerXSmall, centerYSmall, smallRadius, 0, 2 * Math.PI);
                    ctx.fill();

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

        let codeCircleX = ((canvasWidth / 2) - (3.5 * largeRadius))
        let codeCircleY = canvasHeight - 35

        for(let drawActualCodeCircles = 0; drawActualCodeCircles <= 3; drawActualCodeCircles++){

            drawSolidCircle(ctx, codeCircleX, codeCircleY, largeRadius)

            codeCircleX += 50;
        }

    }, []);

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
            setClickedColorHoleIndices(null)
        }
    }, [clickedColorHoleIndices])

    useEffect(() => {

        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        if(clickedGameHoleIndices !== null){

            let centerX = (40 + (clickedGameHoleIndices[0] * 50))
            let centerY = (40 + yOffset + (clickedGameHoleIndices[1] * 50))

            drawSolidCircle(ctx, centerX, centerY, largeRadius, false, 0, true)
            setClickedGameHoleIndices(null)
        }

    }, [clickedGameHoleIndices])



    const drawSolidCircle = (ctx, centerX, centerY, radius, colorPicker = false, colorPickerIndex = 0, click = false) => {

        let fillStyle = null

        if(click === true){

            fillStyle = gameBoardCircleFillColor;
        
        } else {

            fillStyle = 'gray'
        }
        
        if(colorPicker === true){

            switch(colorPickerIndex){

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
        }

        ctx.beginPath();
        ctx.fillStyle = fillStyle
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    const drawColorPicker = (ctx) => {

        for(let drawColorPickerCircleIndex = 0; drawColorPickerCircleIndex <= 5; drawColorPickerCircleIndex++){

            let centerXLarge = (30 + (drawColorPickerCircleIndex * 48));
            let centerYLarge = 40
            
            drawSolidCircle(ctx, centerXLarge, centerYLarge, colorPickerCircleRadius, true, drawColorPickerCircleIndex)
        }
    }

    const removeCursorClass = () => {

        document.body.classList.forEach(className => {
            if (className.endsWith('cursor')) {
                document.body.classList.remove(className);
            }
        });
    }

    return (

        <canvas className="my-3 centered" ref={canvasReference} width={canvasWidth} height={canvasHeight} />
    )
}