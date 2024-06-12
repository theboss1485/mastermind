import React, { useRef, useEffect } from 'react';
export default function GameBoard(){

    const canvasReference = useRef(null)

    useEffect(() => {
        const canvas = canvasReference.current;
        const ctx = canvas.getContext('2d');

        // Use ctx to draw on the canvas
        ctx.fillStyle = 'blue';
        ctx.fillRect(50, 25, 100, 50);
    }, []);

    return (

        <canvas ref={canvasReference}width="200" height="100" />
    )
}