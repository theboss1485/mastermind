import { createSlice } from '@reduxjs/toolkit'
import { globalData } from '../../globalData'

const staticSlice = createSlice({

    name: 'static',
    initialState: globalData,
})

export default staticSlice.reducer