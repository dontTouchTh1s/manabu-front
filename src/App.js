import React, {useRef, useState} from "react";
import {Alert, Box, Container, CssBaseline, IconButton, Snackbar, ThemeProvider} from "@mui/material";
import RTL from "./Themes/RTL";
import RTLTheme from "./Themes/RTLTheme";
import UserContext from "./Contexts/UserContext"
import MenuAppBar from "./Components/Header/Appbar";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import NavigationMenu from "./Components/NavigationMenu/NavigationMenu";
import RouterBreadcrumbs from "./Components/RouterBreadCrumbs";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Grid from "@mui/material/Unstable_Grid2";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function App() {
    const location = useLocation();
    const navigate = useNavigate();

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
                            <Container maxWidth={'md'} sx={{mb: 2, mt: 8}}>
                                <Grid container sx={{display: 'flex', alignItems: 'center'}}>
                                    <Grid xs={1} sx={{display: 'flex', justifyContent: 'left'}}>
                                        <IconButton onClick={() => navigate(1)}>
                                            <ArrowForwardIosIcon/>
                                        </IconButton>
                                    </Grid>
                                    <Grid xs={10}>
                                        <RouterBreadcrumbs/>
                                    </Grid>
                                    <Grid xs={1} sx={{display: 'flex', justifyContent: 'right'}}>
                                        <IconButton onClick={() => navigate(-1)}>
                                            <ArrowBackIosNewIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
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
