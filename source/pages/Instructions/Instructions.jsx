import './Instructions.css'
import {Link} from 'react-router-dom';

export default function Instructions({onBackButtonClick}){

    return (
        <>
            <p className='mx-4'>
                Mastermind is a classic code breaking game.  To begin, click the play button.  Then, the computer will generate a four color combination
                consisting of the colors red, blue, yellow, green, orange, and purple.  Click the color buttons to construct your own guess as to what
                the color is.  Then click the 'Make a Guess' button. The computer will then display your guess, along with the number of black pegs and the 
                number of white pegs you have.  Black pegs represent the number of correct colors you have placed in their correct positions.  White pegs 
                represent the number of correct colors you have in incorrect positions.  The game ends when you have either figured out the correct 
                color combination or made 10 guesses. Standard Mastermind has 6 colors and allows 4 colors per guess and 12 guesses.  Super Mastermind has
                8 colors and allows 5 colors per guess and 12 guesses.  Mini Mastermind has 6 colors and allows 4 colors per guess and 6 guesses.
            </p>
            <div className='fit-content mx-auto py-2'>
                <Link to="/instructions" onClick={onBackButtonClick}>
                    <button className='btn btn-teal'>
                        Go Back
                    </button>
                </Link>
            </div>
        </>
    )
}