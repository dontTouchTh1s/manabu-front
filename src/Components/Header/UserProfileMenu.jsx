import {Button, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {Link, useNavigate} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import * as React from "react";
import {useState} from "react";

function UserProfileMenu({user}) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleNavigate(path) {
        navigate(path);
    }

    return (
        <Stack spacing={{xs: 1, md: 2}} direction={'row'}>
            {
                user ?
                    <>
                        <Box sx={{alignItems: 'center', display: {xs: 'none', sm: 'flex'},}}>
                            <Typography component={'span'} variant={"body1"}>
                                {user.fName + ' ' + user.lName}
                            </Typography>
                        </Box>
                        <div>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: {xs: 'flex', sm: 'none'},
                                    }}>
                                    <Typography component={'span'} variant={"body1"}>
                                        {user.fName + ' ' + user.lName}
                                    </Typography>
                                </Box>
                                <MenuItem onClick={() => {
                                    handleClose()
                                    handleNavigate('/edit-profile')
                                }}>
                                    پروفایل من
                                </MenuItem>
                                {
                                    !user.teacher && (
                                        <MenuItem onClick={() => {
                                            handleClose()
                                            handleNavigate('/teachers/register')
                                        }}>
                                            ثبت نام به عنوان مدرس
                                        </MenuItem>)
                                }
                                <MenuItem onClick={() => {
                                    handleClose()
                                    handleNavigate('/logout')
                                }}>
                                    خروج
                                </MenuItem>
                            </Menu>
                        </div>
                    </> :
                    <>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Link to={'/login'}>
                                <Button
                                    sx={{}}
                                    color={'onPrimary'}
                                    variant={'text'}>
                                    {'ورود'}
                                </Button>
                            </Link>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Link to={'/register'}>
                                <Button
                                    sx={{}}
                                    color={'onPrimary'}
                                    variant={'outlined'}>
                                    {'ثبت نام'}
                                </Button>
                            </Link>
                        </Box>
                    </>
            }

            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle/>
            </IconButton>
        </Stack>
    );
}

export default UserProfileMenu;