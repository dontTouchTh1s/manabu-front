import {
    Box, Button,
    Container, Divider, Skeleton,
    Typography, Link as MuiLink
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Api from "../../Api/Api";
import {Link as RouterLink, Link, useNavigate, useOutletContext, useParams} from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import UploadBox from "../../Components/UploadBox";
import LoadingCircle from "../../Components/LoadingCircle";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import React from "react";
import useHomeWork from "../../Hooks/useHomeWork";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.section);
}

function StudentViewSection() {
    const {sectionId, courseId} = useParams();
    const {
        data: section,
        isLoading: sectionIsLoading,
        mutate: mutate
    } = useSWRImmutable('/section/' + sectionId, fetcher, {revalidateOnMount: true, revalidateOnFocus: true});

    const {
        homeWorks,
        homeWorksIsLoading,
    } = useHomeWork(courseId, sectionId);

    const setAppSnackbarStatus = useOutletContext()[1];

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                مشاهده جلسه
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    اطلاعات جلسه
                                </Typography>
                            </Divider>
                            <Typography component="p" variant="subtitle1">
                                {'عنوان جلسه: '}
                                {
                                    !sectionIsLoading ?
                                        <Link to={'/teachers/courses/' + courseId + '/' + sectionId}>
                                            <Button variant={'text'}>
                                                {section.title}
                                            </Button>
                                        </Link>
                                        : <Skeleton variant={'text'} width={50}/>
                                }
                            </Typography>
                            <Typography component="p" variant="subtitle1">
                                {'نمره: '}
                                {
                                    !sectionIsLoading ?
                                        section.score
                                        : <Skeleton variant={'text'} width={50}/>
                                }
                            </Typography>
                            <Typography component="p" variant="subtitle1">
                                {'توضیحات جلسه: '}
                                {
                                    !sectionIsLoading ?
                                        section.descriptions
                                        : <Skeleton variant={'text'} width={50}/>
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    فایل جلسه
                                </Typography>
                            </Divider>
                            <Typography component="p" variant="body1">
                                در این بخش میتوانید فایل مربوط به جلسه را دانلود کنید.
                            </Typography>
                        </Grid>
                        <Grid xs={12}>

                            {
                                !sectionIsLoading ?
                                    !section.link ?
                                        <>
                                            <Typography component="p" variant="body1">
                                                مدرس هنوز فایلی برای این جلسه آپلود نکرده است.
                                            </Typography>
                                        </>
                                        :
                                        // <Link href={section.link}>
                                        <MuiLink href={section.link}>
                                            <Button endIcon={<AttachFileIcon fontSize={'large'}/>}>
                                                دانلود فایل
                                            </Button>
                                        </MuiLink>
                                    // </Link>
                                    :
                                    <LoadingCircle/>
                            }
                        </Grid>
                    </Grid>
                    <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    تکلیف جلسه
                                </Typography>
                            </Divider>
                            <Grid xs={12}>
                                <Typography component="p" variant="body1">
                                    در صورتی که مدرس برای این جلسه تکیلی تعیین کرده باشد، از بخش می توانید آن را دانلود
                                    یه
                                    به آن پاسخ دهید.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid xs={12}>
                            {
                                !homeWorksIsLoading ?
                                    homeWorks ?
                                        <>
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
                                                    <Typography component="p" variant="body1">
                                                        مدرس برای این تکلیف فایلی در نظر نگرفته است.
                                                    </Typography>
                                                    :
                                                    <MuiLink
                                                        href={'http://localhost:8080/manabu/homework/download/' + homeWorks.file.id + '/' + homeWorks.file.format}>
                                                        <Button endIcon={<AttachFileIcon fontSize={'large'}/>}>
                                                            دانلود فایل
                                                        </Button>
                                                    </MuiLink>
                                            }
                                        </>
                                        :
                                        <Typography component="p" variant="body2">
                                            هنوز تکلیفی برای این جلسه مشخص نشده است.
                                        </Typography>
                                    : <LoadingCircle/>
                            }
                        </Grid>

                    </Grid>

                </Grid>

            </Container>
        </Box>
    );
}

export default StudentViewSection;