import {
    Alert, Box, Button,
    Checkbox,
    Container, FormControl, FormControlLabel,
    InputLabel, MenuItem, Select, Skeleton,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Api from "../../Api/Api";

import {Link, useParams} from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import CreateHomeWork from "./CreateHomeWork";
import LoadingCircle from "../../Components/LoadingCircle";

;


async function sectionFetcher(url) {
    return Api.get(url).then(response => response.data.section);
}

async function fetcher(url) {
    return Api.get(url).then(response => response.data.homeWork);
}

function ManageHomeWorks() {
    const {courseId, sectionId} = useParams();

    const {
        data: section,
        isLoading: sectionIsLoading
    } =
        useSWRImmutable('/section/' + sectionId, sectionFetcher, {revalidateOnMount: true});

    const {
        data: homeWorks,
        isLoading: homeWorksIsLoading
    } =
        useSWRImmutable('homework/' + courseId + '/' + sectionId, fetcher, {revalidateOnMount: true});


    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                {'تکلیف جلسه'}
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Typography component="p" variant="subtitle1">
                    {'عنوان جلسه: '}
                    {
                        !sectionIsLoading ?
                            <Link to={'/teachers/courses/' + courseId + '/sections/' + section.id}>
                                <Button variant={'text'}>
                                    {section.title}
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
                        !sectionIsLoading ? section.descriptions :
                            <>
                                <Skeleton variant={'text'} width={'100%'}/>
                                <Skeleton variant={'text'} width={'100%'}/>
                            </>
                    }
                </Typography>
                <Grid container spacing={{xs: 2, md: 3}} sx={{mt: 1}}>
                    {
                        !homeWorksIsLoading ?
                            homeWorks ?
                                <></>
                                :
                                <CreateHomeWork/>
                            :
                            <LoadingCircle/>

                    }

                </Grid>
            </Container>
        </Box>
    );
}

export default ManageHomeWorks;