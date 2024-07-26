import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import store from '../store/index.js'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Error from './pages/Error/Error.jsx';
import Game from './pages/Game/Game.jsx';
import Instructions from './pages/Instructions/Instructions.jsx'

const router = createBrowserRouter([

    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
        children: [
            
            {
                index: true,
                element: <Game />
            },
            {
                path: '/instructions',
                element: <Instructions />,
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router}> 
            <App />
        </RouterProvider>
    </Provider>
)