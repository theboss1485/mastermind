import { configureStore } from '@reduxjs/toolkit'
import {globalData} from './globalData'
import rootReducer from './reducers/rootReducer';

// const reducer = (state = globalData, action) => {

//     return state
// }

const store = configureStore({reducer: rootReducer})

export default store;