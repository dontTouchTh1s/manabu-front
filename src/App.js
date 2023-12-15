import React, {useRef, useState} from "react";
import {Alert, Box, Container, CssBaseline, Snackbar, ThemeProvider} from "@mui/material";
import RTL from "./Themes/RTL";
import RTLTheme from "./Themes/RTLTheme";
import Api from "./Api/Api";
import UserContext from "./Contexts/UserContext"
import MenuAppBar from "./Components/Header/Appbar";
import {Outlet, useLocation} from "react-router-dom";
import NavigationMenu from "./Components/NavigationMenu/NavigationMenu";
import getCookie from "./Functions/GetCookie/GetCookie";
import RouterBreadcrumbs from "./Components/RouterBreadCrumbs";

function App() {
    const location = useLocation();

    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        message: '',
        type: 'error',
    });

    const user = useRef({
        navigationMenuUser: undefined, setNavigationMenuUser: () => {
        },
        appBarUser: undefined, setAppBarUser: () => {
        }
    });

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarStatus({
            ...snackbarStatus, open: false
        });
    }

    return (
        <RTL>
            <ThemeProvider theme={RTLTheme}>
                <CssBaseline/>
                <UserContext.Provider value={user}>
                    <MenuAppBar/>
                    <Box pb={8} pt={2}>
                        {
                            location.pathname !== '/' &&
                            <Container maxWidth={'md'} sx={{mt: 1}}>
                                <RouterBreadcrumbs/>
                            </Container>
                        }
                        <Outlet context={[snackbarStatus, setSnackbarStatus]}>
                        </Outlet>
                    </Box>
                    <NavigationMenu/>
                </UserContext.Provider>
                <Snackbar
                    open={snackbarStatus.open}
                    autoHideDuration={6000}
                    onClose={handleSnackBarClose}>
                    <Alert severity={snackbarStatus.type} sx={{width: '100%'}}>
                        {snackbarStatus.message}
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </RTL>
    );
}

export default App;
