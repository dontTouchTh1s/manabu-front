import {useContext, useState} from "react";
import Api from "../../Api/Api";
import CourseCard from "../Courses/CourseCard";
import {
    Box,
    Container, Fab,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import useSWR from "swr";
import LoadingCircle from "../../Components/LoadingCircle";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import userContext from "../../Contexts/UserContext";
import useSWRImmutable from "swr/immutable";

async function searcher(url) {
    return Api.get(url).then(response => response.data);
}

function RecommendedCourses() {
    const {
        data: courses,
        isLoading: courseIsLoading
    } = useSWRImmutable('/recommender', searcher, {revalidateOnMount: true});


    const user = useContext(userContext);
    const navigate = useNavigate();

    return (
        <>
            <Box>
                <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                    دوره ها
                </Typography>
                <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                    <Grid container spacing={{xs: 2, md: 3}}>

                        {
                            !courseIsLoading ?
                                courses.suggestion.length !== 0 ?
                                    courses.map(course =>
                                        <Grid key={course.id} xs={12} sm={6} md={4}>
                                            <CourseCard course={course}>
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
                                    </Grid>
                                : <LoadingCircle height={'100%'}/>
                        }

                    </Grid>
                </Container>
                {
                    user.current.appBarUser.teacher &&
                    <Fab color="primary" variant={'extended'} aria-label="افزودن"
                         onClick={() => {
                             navigate('/teachers/courses/create')
                         }}
                         sx={{position: 'fixed', bottom: 75, right: 10}}
                    >
                        <AddIcon/>
                        ایجاد دوره
                    </Fab>
                }
            </Box>

        </>
    );
}


export default RecommendedCourses;