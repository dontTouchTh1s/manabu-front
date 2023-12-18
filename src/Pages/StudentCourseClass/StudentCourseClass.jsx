import {
    Alert, Box, Button,
    Container, Divider, Fab, Skeleton,
    Snackbar,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, {useContext, useState} from "react";
import UserContext from "../../Contexts/UserContext";
import {Link, useParams} from "react-router-dom";
import '../../Themes/custom-scrollbar.css';
import useCourse from "../../Hooks/useCourse";
import HandleExam from "../ManageCourse/HandleExam";
import HandleSections from "./HandleSections";
import ChatBox from "../../Components/ChatBox/ChatBox";
import ChatIcon from "@mui/icons-material/Chat";
import RTLTheme from "../../Themes/RTLTheme";

function StudentCourseClass() {
    const {courseId} = useParams();
    const {course, courseIsLoading} = useCourse(courseId);
    const [chatBoxIsOpen, setChatBoxIsOpen] = useState(false);
    // Snackbar
    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        type: 'error',
        message: ''
    });

    const user = useContext(UserContext);

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarStatus({...snackbarStatus, open: false});
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                کلاس
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} container>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    مشخصات دوره
                                </Typography>
                            </Divider>

                            <Typography component="p" variant="subtitle1">
                                {'عنوان دوره: '}
                                {
                                    !courseIsLoading ?
                                        <Link to={'/courses/' + courseId}>
                                            <Button variant={'text'} size={'medium'}>{course.title}</Button>
                                        </Link>
                                        : <Skeleton variant={'text'} width={50}/>
                                }
                            </Typography>

                            <Typography component="p" variant="subtitle1">
                                {'توضیحات دوره: '}
                                {
                                    !courseIsLoading ?
                                        course.descriptions
                                        : <Skeleton variant={'text'} width={50}/>
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={12} container>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    جلسات
                                </Typography>
                            </Divider>

                            <Typography component="p" variant="subtitle1">
                                آخرین جلسات دوره
                            </Typography>
                        </Grid>
                        <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                            <HandleSections courseId={courseId}/>
                        </Grid>
                        <Grid xs={12}>
                            <Link to={'./sections'}>
                                <Button variant={'text'}>
                                    مشاهده همه جلسات
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid xs={12} container>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    امتحان پایانی
                                </Typography>
                            </Divider>
                        </Grid>
                        <Grid xs={12}>
                            <HandleExam courseId={courseId}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            {
                !courseIsLoading ?
                    <>
                        <Fab color="primary" variant={'extended'} aria-label="گفت و گو با استاد"
                             sx={{
                                 position: 'fixed',
                                 [RTLTheme.breakpoints.down('md')]: {
                                     bottom: 60,
                                     left: 5,
                                     transition: '300ms ease-in-out',
                                     overflow: 'hidden',
                                     maxWidth: 30,

                                     '&:hover': {
                                         maxWidth: 140,
                                     },
                                     '> span': {
                                         display: 'none'
                                     },
                                     '&:hover > span': {
                                         display: 'block'
                                     }
                                 },

                                 [RTLTheme.breakpoints.up('md')]: {
                                     bottom: 80,
                                     left: 20,
                                 },
                             }}
                             onClick={() => setChatBoxIsOpen(!chatBoxIsOpen)}
                        >
                            <ChatIcon fontSize={'small'}/>
                            <Typography component={'span'} variant={'body1'} sx={{ml: 1}}>
                                چت با استاد
                            </Typography>

                        </Fab>
                        <ChatBox teacher={course.teacher} user={user.current.appBarUser} isOpen={chatBoxIsOpen}
                                 onChange={(v) => setChatBoxIsOpen(v)}/>
                    </>

                    : ''
            }
            <Snackbar
                open={snackbarStatus.open}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}>
                <Alert severity={snackbarStatus.type} sx={{width: '100%'}}>
                    {snackbarStatus.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default StudentCourseClass;