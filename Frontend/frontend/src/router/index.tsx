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
import Books from "../pages/Books";
import BookDetail from "../pages/BookDetail";
import BorrowedBooks from "../pages/BorrowedBooks";
import LibraryMap from "../pages/LibraryMap";
import HeatmapAreas from "../pages/HeatmapAreas";


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
        path:"/shelves/:area_id",
        element:<Shelves />,
    },
    {
        path: "/books",
        element: <Books />,
    },
    {
        path: "/book/:bookId",
        element: <BookDetail />
    },
    {
        path: "/broadcasts",
        element: <Broadcasts />,
    },
    {
        path: "/my-borrows",
        element: <BorrowedBooks />
    },
    {
        path: "/map",
        element: <LibraryMap />,
    },
    {
        path:"/areas/heatmap",
        element:<HeatmapAreas />,
    }
]);

export default router;
