import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText, styled,
    useTheme
} from "@mui/material";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SchoolIcon from "@mui/icons-material/School";
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HomeIcon from "@mui/icons-material/Home";
import HowToRegIcon from '@mui/icons-material/HowToReg';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export default function MiniDrawer({isTeacher, isOpen, onChange}) {
    const theme = useTheme();
    const [open, setOpen] = useState(isOpen);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleDrawerClose = () => {
        setOpen(false);
        onChange(false);
    };

    return (
        <Box sx={{display: 'flex',}}>
            <Drawer
                onClose={handleDrawerClose}
                open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>

                <Divider/>
                <List sx={{
                    width: drawerWidth
                }}>
                    <ListItem disablePadding sx={{display: 'block'}}>
                        <Link
                            onClick={handleDrawerClose}
                            to={'/student/courses'}
                            style={{
                                textDecoration: 'none ',
                                color: "inherit"
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'inherit',
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AutoStoriesIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'دروس ثبت نام شده'} sx={{
                                    opacity: open ? 1 : 0,
                                    color: 'inherit'
                                }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    {
                        isTeacher &&
                        <ListItem disablePadding sx={{display: 'block'}}>
                            <Link
                                onClick={handleDrawerClose}
                                to={'/teachers/courses'}
                                style={{
                                    textDecoration: 'none ',
                                    color: "inherit"
                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: 'inherit',
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}>
                                        <CastForEducationIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'دروس درحال تدریس'} sx={{
                                        opacity: open ? 1 : 0,
                                        color: 'inherit'
                                    }}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    }
                    <ListItem disablePadding sx={{display: 'block'}}>
                        <Link
                            onClick={handleDrawerClose}
                            to={'/teachers'}
                            style={{
                                textDecoration: 'none ',
                                color: "inherit"
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'inherit',
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}>
                                    <SchoolIcon/>
                                </ListItemIcon>

                                <ListItemText primary={'مدرس ها'} sx={{
                                    opacity: open ? 1 : 0,
                                    color: 'inherit'
                                }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    {
                        !isTeacher &&
                        <ListItem disablePadding sx={{display: 'block'}}>
                            <Link
                                onClick={handleDrawerClose}
                                to={'/teachers/register'}
                                style={{
                                    textDecoration: 'none ',
                                    color: "inherit"
                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: 'inherit',
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}>
                                        <HowToRegIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'ثبت نام به عنوان مدرس'} sx={{
                                        opacity: open ? 1 : 0,
                                        color: 'inherit'
                                    }}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    }
                </List>
                <Divider/>
                <List sx={{
                    width: drawerWidth
                }}>
                    <ListItem disablePadding sx={{display: 'block'}}>
                        <Link
                            onClick={handleDrawerClose}
                            to={'/'}
                            style={{
                                textDecoration: 'none ',
                                color: "inherit"
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'inherit',
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}>
                                    <HomeIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'آریا'} sx={{
                                    opacity: open ? 1 : 0,
                                    color: 'inherit'
                                }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>

                </List>
            </Drawer>
        </Box>
    );
}