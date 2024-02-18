import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Logform from '../layout/Logform'
import Regform from '../layout/regform'
import useAuth from '../Hooks/useAuth'
import Header from '../layout/Header'
import RentBook from '../layout/RentBook'
import Dashboard from '../layout/Dashboard'
import UserProfile from '../layout/UserProfile'
import RentBookAdmin from '../layout/AdminRentBook'
import Insert from '../layout/insertRentbook'
import Edit from '../layout/AdminRentBookEdit'
import Users from '../layout/AdminUsers'
import InsertUsers from '../layout/insertUsers'
import EditUsers from '../layout/editUsers'

const guestRouter = createBrowserRouter([
    {
        path: '/',
        element: <>
            <Header/>
            <Outlet />
        </>,
        children: [
            { index: true, element: <Logform /> },
            { path: '/register', element: <Regform /> }
        ]
    }
])

const userRouter = createBrowserRouter([
    {
        path: '/',
        element: <>
            <Header/>
            <Outlet />
        </>,
        children: [
            { index: true, element: <Dashboard/> },
            { path: '/rentbook', element: <RentBook/> },
            { path: '/profile', element: <UserProfile/> },
            { path: '/rentBookAdmin', element: <RentBookAdmin/> },
            { path: '/insert', element: <Insert/> },
            { path: '/edit', element: <Edit/> },
            { path: '/users', element: <Users/> },
            { path: '/created', element: <InsertUsers/> },
            { path: '/edituser', element: <EditUsers/> },
        ]
    }
])


export default function AppRouter() {
    const {user} = useAuth()
    const finalRouter = user?.id ? userRouter : guestRouter
    return (
        <RouterProvider router={finalRouter} />
    )
}
