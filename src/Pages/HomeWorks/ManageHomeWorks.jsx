import {
    Alert, Box, Button,
    Checkbox,
    Container, Divider, FormControl, FormControlLabel,
    InputLabel, MenuItem, Select, Skeleton, Stack,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Api from "../../Api/Api";

import {Link, useNavigate, useParams} from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import CreateHomeWork from "./CreateHomeWork";
import LoadingCircle from "../../Components/LoadingCircle";
import React, {useEffect} from "react";
import UploadBox from "../../Components/UploadBox";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {Link as MuiLink} from '@mui/material';
import useHomeWork from "../../Hooks/useHomeWork";


async function sectionFetcher(url) {
    return Api.get(url).then(response => response.data.section);
}

function ManageHomeWorks() {
    const {courseId, sectionId} = useParams();

    const {
        data: section,
        isLoading: sectionIsLoading
    } =
        useSWRImmutable('/section/' + sectionId, sectionFetcher, {revalidateOnMount: true});

    const {
        homeWorks,
        homeWorksIsLoading,
        homeWorksMutate
    } = useHomeWork(courseId, sectionId);

    const navigate = useNavigate();
    useEffect(() => {
        if (!sectionIsLoading) {
            if (parseInt(section.courseId) !== parseInt(courseId)) {
                navigate('/courses');
            }

        }
    }, [section]);

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
                    توضیحات:
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
                                <>
                                    <Grid xs={12}>
                                        <Stack spacing={1.5}>
                                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                                <Typography component="p" variant="h6">
                                                    اطلاعات تکلیف
                                                </Typography>
                                            </Divider>
                                            <Typography component="p" variant="subtitle1">
                                                {'عنوان تکلیف: '}
                                                {
                                                    !sectionIsLoading ?
                                                        homeWorks.title
                                                        : <Skeleton variant={'text'} width={50}/>
                                                }
                                            </Typography>
                                            <Typography component="p" variant="subtitle1">
                                                {'توضیحات تکلیف: '}
                                                {
                                                    !sectionIsLoading ?
                                                        homeWorks.description
                                                        : <Skeleton variant={'text'} width={50}/>
                                                }
                                            </Typography>
                                            {
                                                !homeWorks.file ?
                                                    <UploadBox autoUpload={true}
                                                               uploadUrl={'/upload/homework/' + homeWorks.id}
                                                               onUpload={async () => homeWorksMutate()}/> :
                                                    <MuiLink
                                                        href={'http://localhost:8080/manabu/homework/download/' + homeWorks.file.id + '/' + homeWorks.file.format}>
                                                        <Button endIcon={<AttachFileIcon fontSize={'large'}/>}>
                                                            دانلود فایل
                                                        </Button>
                                                    </MuiLink>
                                            }
                                        </Stack>
                                    </Grid>
                                </>
                                :
                                <>
                                    <Grid xs={12}>
                                        <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                            <Typography component="p" variant="h6">
                                                ایجاد تکلیف
                                            </Typography>
                                        </Divider>
                                        <CreateHomeWork/>
                                    </Grid>
                                </>

                            :
                            <LoadingCircle/>

                    }

                </Grid>
            </Container>
        </Box>
    );
}

export default ManageHomeWorks;