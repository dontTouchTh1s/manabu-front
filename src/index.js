import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ErrorPage from "./Pages/ErrorPages/ErrorPage";
import AlreadyLogin from "./Components/AlreadyLogin";
import {Logout} from "@mui/icons-material";
import ProtectedRoute, {loader as protectedRouteLoader} from "./Components/ProtectedRoute";
import ShowAllCourses from "./Pages/Courses/ShowAllCourses";
import CreateTeacher from "./Pages/CreateTeacher/CreateTeahcer";
import CreateCourse from "./Pages/CreateCourse/CreateCourse";
import CurrentTeacherCourses from "./Pages/CurrentTecherCourses/CurrentTeacherCourses";
import ManageSections from "./Pages/ManageSections/ManageSections";
import CreateSection from "./Pages/CreateSection/CreateSection";
import ManageHomeWorks from "./Pages/HomeWorks/ManageHomeWorks";
import ManageCourse from "./Pages/ManageCourse/ManageCourse";
import ViewCourse from "./Pages/ViewCourse/ViewCourse";
import TeacherInfo from "./Pages/TeacherInfo/TeacherInfo";
import TeachersAll from "./Pages/TeachersAll/TeachersAll";
import RegisteredCourses from "./Pages/RegisteredCourses/RegisteredCourses";
import StudentCourseClass from "./Pages/StudentCourseClass/StudentCourseClass";
import Home from "./Pages/Home/Home";


const browserRouter = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: '/',
                        element: <ProtectedRoute noNavigate><Home/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    // Auth
                    {
                        path: '/login',
                        element: <AlreadyLogin><Login/></AlreadyLogin>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/register',
                        element: <AlreadyLogin><Register/></AlreadyLogin>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/logout',
                        element: <Logout/>
                    },

                    // Courses
                    {
                        path: '/courses',
                        element: <ProtectedRoute noNavigate><ShowAllCourses/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/courses/:courseId',
                        element: <ProtectedRoute noNavigate><ViewCourse/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },

                    // Courses for students
                    {
                        path: '/student/courses',
                        element: <ProtectedRoute><RegisteredCourses/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/student/courses/:courseId',
                        element: <ProtectedRoute><StudentCourseClass/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },


                    // Teachers
                    {
                        path: '/teachers',
                        element: <ProtectedRoute><TeachersAll/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/:teacherId',
                        element: <ProtectedRoute><TeacherInfo/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/register',
                        element: <ProtectedRoute><CreateTeacher/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/courses',
                        element: <ProtectedRoute><CurrentTeacherCourses/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/courses/:courseId',
                        element: <ProtectedRoute><ManageCourse/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/courses/create',
                        element: <ProtectedRoute><CreateCourse/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/courses/:courseId/sections',
                        element: <ProtectedRoute><ManageSections/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/courses/:courseId/sections/create',
                        element: <ProtectedRoute><CreateSection/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/courses/:courseId/sections/:sectionId/homeworks',
                        element: <ProtectedRoute><ManageHomeWorks/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    }

                ]
            }
        ]
    }]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={browserRouter}/>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
