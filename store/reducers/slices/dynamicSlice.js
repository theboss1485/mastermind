import { createSlice } from '@reduxjs/toolkit'

const dynamicSlice = createSlice({

    name: 'dynamic',
    initialState: ["N/A", "Mastermind"],

    reducers: {

        updateGameType: (state, action) => {

            let gameTypeArray = []

            switch (action.payload.gameType) {
                case "mini":
                    gameTypeArray.push("mini");
                    gameTypeArray.push("Mini Mastermind");
                    gameTypeArray.push("btn btn-red");
                    break;
                case "regular":
                    gameTypeArray.push("regular");
                    gameTypeArray.push("Standard Mastermind");
                    gameTypeArray.push("btn btn-green");
                    
                    break;
                case "super":
                    gameTypeArray.push("super");
                    gameTypeArray.push("Super Mastermind");
                    gameTypeArray.push("btn btn-yellow");
                    break;
                default:
                    gameTypeArray.push("N/A");
                    gameTypeArray.push("Mastermind");
                    break;
            }

            return {
                ...state,
                gameTypeArray: gameTypeArray
            };
        }
    }
})

export const { updateGameType } = dynamicSlice.actions
export default dynamicSlice.reducer