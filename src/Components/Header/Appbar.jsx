import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import userContext from "../../Contexts/UserContext";
import {Button, Stack} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import MiniDrawer from "../Drawer/Drawer";
import DrawerHandler from "./DrawerHandler";
import UserProfileMenu from "./UserProfileMenu";
import RTLTheme from "../../Themes/RTLTheme";

function MenuAppBar() {
    const user = useContext(userContext);
    const [appBarUser, setAppBarUser] = useState(null);

    user.current = {...user.current, appBarUser, setAppBarUser}

    return (
        <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
            <AppBar position="static" sx={{
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
                    {
                        <DrawerHandler user={appBarUser}/>
                    }
                    {/*<IconButton*/}
                    {/*    color={'onPrimary'}*/}
                    {/*    onClick={() => {*/}
                    {/*        navigate(-1)*/}
                    {/*    }}*/}
                    {/*    aria-label={'back'}>*/}
                    {/*    <ArrowForwardIcon/>*/}
                    {/*</IconButton>*/}

                    <UserProfileMenu user={appBarUser}/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuAppBar;