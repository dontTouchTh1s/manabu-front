import {
    Box, Button,
    Container, Fab, Skeleton,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Api from "../../Api/Api";
import {Link, useNavigate, useParams} from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import SectionSkeleton from "./SectionSkeleton";
import SectionsCard from "./SectionsCard";
import AddIcon from '@mui/icons-material/Add';
import NotDataBox from "../../Components/NotDataBox";
import useCourse from "../../Hooks/useCourse";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.sections);
}

function ManageSections({forStudents = false}) {
    const {courseId} = useParams();
    const navigate = useNavigate();

    const {
        course,
        courseIsLoading
    } = useCourse(courseId);

    const {
        data: sections,
        isLoading: sectionsIsLoading
    } =
        useSWRImmutable('section/' + courseId + '/true', fetcher, {revalidateOnMount: true})


    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                {'جلسات دوره '}
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Typography component="p" variant="subtitle1">
                    {'عنوان دوره: '}
                    {
                        !courseIsLoading ?
                            <Link to={'/teachers/courses/' + course.id}>
                                <Button variant={'text'}>
                                    {course.title}
                                </Button>
                            </Link>
                            : <Skeleton variant={'text'} width={50}/>
                    }
                </Typography>

                <Typography component="p" variant="subtitle1">
                    توضیحات
                </Typography>
                <Typography component="p" variant="body1">
                    {
                        !courseIsLoading ? course.descriptions :
                            <>
                                <Skeleton variant={'text'} width={'100%'}/>
                                <Skeleton variant={'text'} width={'100%'}/>
                            </>
                    }
                </Typography>
                <Grid container spacing={{xs: 2, md: 3}} sx={{mt: 1}}>
                    {
                        !sectionsIsLoading ?
                            sections.length !== 0 ?
                                sections.map(sec =>
                                    <Grid key={sec.id} xs={12} sm={6} md={4}>
                                        <SectionsCard section={sec} forStudent>
                                        </SectionsCard>
                                    </Grid>) :
                                <NotDataBox>
                                    <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                                        {'موردی یافت نشد!'}
                                    </Typography>
                                </NotDataBox>
                            : <><SectionSkeleton/><SectionSkeleton/></>


                    }
                </Grid>
            </Container>
            {
                !forStudents &&
                <Fab color="primary" variant={'extended'} aria-label="افزودن"
                     onClick={() => {
                         navigate('/teachers/courses/' + courseId + '/sections/create')
                     }}
                     sx={{position: 'fixed', bottom: 75}}
                >
                    <AddIcon/>
                    ایجاد جلسه
                </Fab>
            }
        </Box>
    );
}

export default ManageSections;