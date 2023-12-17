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

function StudentCourseClass() {
    const {courseId} = useParams();
    const {course, courseIsLoading} = useCourse(courseId);
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
                {
                    !courseIsLoading ?
                        <ChatBox teacher={course.teacher} user={user.current.appBarUser}/>
                        : ''
                }
            </Container>
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