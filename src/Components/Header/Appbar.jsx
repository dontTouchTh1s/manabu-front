import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import userContext from "../../Contexts/UserContext";
import {Button, Stack, useScrollTrigger} from "@mui/material";

import DrawerHandler from "./DrawerHandler";
import UserProfileMenu from "./UserProfileMenu";
import RTLTheme from "../../Themes/RTLTheme";
import PropTypes from "prop-types";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function ElevationScroll(props) {
    const {children, window} = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

function MenuAppBar() {
    const user = useContext(userContext);
    const [appBarUser, setAppBarUser] = useState(null);

    user.current = {...user.current, appBarUser, setAppBarUser}

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', flexGrow: 10, width: '100%'}}>
            <ElevationScroll>

                <AppBar sx={{
                    right: 'auto',
                    justifyContent: 'center',
                    borderBottomRightRadius: 24,
                    borderBottomLeftRadius: 24,
                    [RTLTheme.breakpoints.down('sm')]: {
                        width: '100%'
                    },
                    [RTLTheme.breakpoints.down('md')]: {
                        maxWidth: RTLTheme.breakpoints.values.sm,
                        width: '90%'
                    },
                    [RTLTheme.breakpoints.down('lg')]: {
                        maxWidth: RTLTheme.breakpoints.values.md,
                        width: '90%'

                    },
                    [RTLTheme.breakpoints.up('lg')]: {
                        maxWidth: RTLTheme.breakpoints.values.lg,
                        width: '80%'
                    }
                }}>
                    <Toolbar sx={{
                        justifyContent: 'space-between'
                    }}>

                        <DrawerHandler user={appBarUser}/>

                        <UserProfileMenu user={appBarUser}/>
                    </Toolbar>
                </AppBar>


            </ElevationScroll>

        </Box>
    );
}

export default MenuAppBar;