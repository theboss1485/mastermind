import { configureStore } from '@reduxjs/toolkit'
import {globalData} from './globalData'

const reducer = (state = globalData, action) => {

    return state
}

const store = configureStore({reducer: reducer})

export default store;