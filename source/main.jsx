import React from 'react'
import ReactDOM from 'react-dom/client'

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
    <RouterProvider router={router} />
)