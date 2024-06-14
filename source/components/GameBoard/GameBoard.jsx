import React, { useRef, useEffect, useState } from 'react';
import './GameBoard.css'
export default function GameBoard(){

    const canvasReference = useRef(null);
    const canvasWidth = 300;
    const canvasHeight = 700;
    
    const largeRadius = 20;

    const [clickedHoleIndices, setClickedHoleIndices] = useState(null);

    useEffect(() => {
        
        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        // Use ctx to draw on the canvas
        canvas.addEventListener('click', (event) => {

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
    
            // Check if the click is inside any of the large holes
            for (let i = 0; i < 48; i++) {

                const holeX = 40 + (i % 4) * 50;
                const holeY = 40 + Math.floor(i / 4) * 50;

                if (Math.pow(x - holeX, 2) + Math.pow(y - holeY, 2) <= Math.pow(20, 2)) {

                    setClickedHoleIndices([(i % 4), (Math.floor(i / 4))]);
                    break;
                }
            }
        });

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgb(166, 90, 36)'); // light brown
        gradient.addColorStop(1, 'rgb(139, 69, 19)'); // dark brown
        ctx.fillStyle = gradient;
        ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
        ctx.fill();

        let centerXSmall = 250;
        let centerYSmall = 27;

        for(let rowIndex = 0; rowIndex <= 11; rowIndex++){

            for(let drawLargeCircles = 0; drawLargeCircles <= 3; drawLargeCircles++){

                let centerXLarge = (40 + (drawLargeCircles * 50)) ;
                let centerYLarge = (40 + (rowIndex * 50))
    
                drawCircle(ctx, centerXLarge, centerYLarge, largeRadius)
            }

            for(let drawSmallCirclesY = 0; drawSmallCirclesY <= 1; drawSmallCirclesY++){

                for (let drawSmallCirclesX = 0; drawSmallCirclesX <= 1; drawSmallCirclesX++){

                    let smallRadius = 7

                    drawCircle(ctx, centerXSmall, centerYSmall, smallRadius)

                    
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

            drawCircle(ctx, codeCircleX, codeCircleY, largeRadius)

            codeCircleX += 50;
        }

    }, []);

    useEffect(() => {

        const canvas = canvasReference.current;
        let ctx = canvas.getContext('2d');

        if(clickedHoleIndices !== null){

            let centerX = (40 + (clickedHoleIndices[0] * 50))
            let centerY = (40 + (clickedHoleIndices[1] * 50))

            drawCircle(ctx, centerX, centerY, largeRadius, true)
            setClickedHoleIndices(null)
        }

    }, [clickedHoleIndices])



    const drawCircle = (ctx, centerX, centerY, radius, click = false) => {

        let fillStyle = null

        if(click === true){

            fillStyle = 'red';
        
        } else {

            fillStyle = 'gray'
        } 

        ctx.beginPath();
        ctx.fillStyle = fillStyle
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    return (

        <canvas className="my-3 centered" ref={canvasReference} width={canvasWidth} height={canvasHeight} />
    )
}