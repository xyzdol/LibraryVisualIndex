// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Search from "../pages/Search";
import Ranking from "../pages/Ranking";
import Areas from "../pages/Areas";
import Shelves from "../pages/Shelves";
import Broadcasts from "../pages/Broadcasts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/search",
        element: <Search />,
    },
    {
        path: "/ranking",
        element: <Ranking />,
    },
    {
        path: "/areas",
        element: <Areas />,
    },
    {
        path: "/shelves",
        element: <Shelves />,
    },
    {
        path: "/broadcasts",
        element: <Broadcasts />,
    },
]);

export default router;
