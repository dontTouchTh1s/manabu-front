import Api from "../../Api/Api";
import {Box, Container, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CourseCard from "./CourseCard";
import useSWRImmutable from "swr/immutable";
import LoadingCircle from "../../Components/LoadingCircle";
import {useContext} from "react";
import userContext from "../../Contexts/UserContext";

async function fetcher([url, params]) {
    return Api.post(url, params).then(response => response.data.courses.courses);
}

function CurrentTeacherCourses() {
    const user = useContext(userContext).current.appBarUser;
    const {data: teacherCourses, isLoading: teacherCoursesIsLoading} =
        useSWRImmutable(['/search/course', {teacherId: user.teacher.id}], (url, params) => fetcher(url, params));
    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                دوره های ایجاد شده
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    {
                        !teacherCoursesIsLoading ?
                            teacherCourses.length !== 0 ?
                                teacherCourses.map(teacherCourses =>
                                    <Grid key={teacherCourses.id} xs={12} sm={6} md={4}>
                                        <CourseCard course={teacherCourses}>
                                        </CourseCard>
                                    </Grid>
                                ) :
                                <Grid xs={12} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '400px'
                                }}>
                                    <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                                        {'موردی یافت نشد!'}
                                    </Typography>
                                </Grid> : <LoadingCircle height={'100%'}/>
                    }

                </Grid>
            </Container>
        </Box>);
}

export default CurrentTeacherCourses;