import staticReducer from './slices/staticSlice'
import dynamicReducer from './slices/dynamicSlice'
import { combineReducers } from '@reduxjs/toolkit'

// This function combines the reducers from the three slice files into one large reducer.
const rootReducer = combineReducers({

    static: staticReducer,
    dynamic: dynamicReducer
})

export default rootReducer;