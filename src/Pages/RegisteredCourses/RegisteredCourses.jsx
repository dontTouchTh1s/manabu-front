import {useLoaderData} from "react-router-dom";
import Api from "../../Api/Api";
import {Box, Container, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CourseCard from "./CourseCard";
import useSWRImmutable from "swr/immutable";
import LoadingCircle from "../../Components/LoadingCircle";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.takeCourse);
}

function RegisteredCourses() {
    const {
        data: courses,
        isLoading: coursesIsLoading
    } = useSWRImmutable('/myCourse/100/0', fetcher, {revalidateOnMount: true});

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                دوره های ثبت نام شده
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    {
                        !coursesIsLoading ?
                            courses.length !== 0 ?
                                courses.map(takenCourse =>
                                    <Grid key={takenCourse.id} xs={12} sm={6} md={4}>
                                        <CourseCard takenCourse={takenCourse}>
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
                                </Grid> :
                            <LoadingCircle/>
                    }

                </Grid>
            </Container>
        </Box>);
}

export default RegisteredCourses;