import {Await, defer, useLoaderData, useNavigate, useOutletContext} from "react-router-dom";
import {Suspense, useContext, useEffect, useRef, useState} from "react";

import UserContext from "../Contexts/UserContext";
import getCookie from "../Functions/GetCookie/GetCookie";
import LoadingCircle from "./LoadingCircle";
import Api from "../Api/Api";

export async function loader() {
    if (!getCookie(process.env.REACT_APP_SESSION_COOKIE_NAME)) {
        try {
            await Api.post('/session');
        } catch (e) {
            throw new Response("یک خطای غیر منتطره رخ داد!", {status: 500})
        }
    }
    if (getCookie(process.env.REACT_APP_AUTH_COOKIE_NAME)) {
        try {
            let response = Api.get('/user');
            return defer({currentUser: response});
        } catch (error) {
            return {currentUser: null};
        }
    } else {
        return {currentUser: null};
    }
}

function ProtectedRoute({noNavigate = false, requiredRole = ['teacher', 'user'], children}) {
    const data = useLoaderData();
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [auth, setAuth] = useState(false);
    const nav = useRef('');
    const setAppSnackbarStatus = useOutletContext()[1];

    async function checkUser() {
        let userData = await data.currentUser;
        if (userData) {
            user.current.setAppBarUser(userData.data.user);
            user.current.setNavigationMenuUser(userData.data.user);
            const userRoll = userData.data.user.teacher ? 'teacher' : 'user';
            if (!requiredRole.includes(userRoll)) {
                nav.current = '/courses';
                setAppSnackbarStatus({
                    open: 'true',
                    type: 'error',
                    message: 'شما به صفحه مورد نظر دسترسی لازم را ندارید.'
                });
            }
        } else {
            user.current.setAppBarUser(null);
            user.current.setNavigationMenuUser(null);
            nav.current = '/login';
        }
        setAuth(true);
    }

    if (!auth) checkUser();

    useEffect(() => {
        if (!noNavigate) {
            if (nav.current !== '')
                navigate(nav.current);
        }
    }, []);

    return (
        <Suspense
            fallback={<LoadingCircle height={'80vh'}/>}
        >
            <Await
                resolve={data.currentUser}
                errorElement={
                    <p>Error loading package location!</p>
                }
                children={auth && children}
            >
            </Await>
        </Suspense>
    );
}

export default ProtectedRoute