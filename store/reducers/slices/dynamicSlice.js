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
                    break;
                case "regular":
                    gameTypeArray.push("regular");
                    gameTypeArray.push("Standard Mastermind");
                    break;
                case "super":
                    gameTypeArray.push("super");
                    gameTypeArray.push("Super Mastermind");
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