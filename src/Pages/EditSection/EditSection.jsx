import {
    Box, Button, Container, Divider,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Api from "../../Api/Api";
import {Link as RouterLink, useNavigate, useOutletContext, useParams} from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import UpdateSectionInfo from "./UpdateSectionInfo";
import UploadBox from "../../Components/UploadBox";
import Link from "@mui/material/Link";
import LoadingCircle from "../../Components/LoadingCircle";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import React, {useEffect} from "react";
import NotFound from "../ErrorPages/NotFound";

async function fetcher(url) {
    const res = await Api.get(url);
    const section = res.data.section;
    if (!section) {
        const error = new Error(res.data.msg)

        error.name = 'پیدا نشد!';
        error.status = 404;
        throw error
    }
    return section;
}

function CreateSection() {
    const {sectionId, courseId} = useParams();
    const navigate = useNavigate();
    const setAppSnackbarStatus = useOutletContext()[1];

    const {
        data: section,
        isLoading: sectionIsLoading,
        mutate: mutate,
        error: error
    } = useSWRImmutable('/section/' + sectionId, fetcher, {revalidateOnMount: true, revalidateOnFocus: true});

    useEffect(() => {
        if (!sectionIsLoading) {
            if (!error) {
                if (parseInt(section.courseId) !== parseInt(courseId)) {
                    navigate('/courses');
                }
            }

        }
    }, [section]);

    if (error) {
        return <NotFound error={error}/>
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                ویرایش جلسه
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    فایل جلسه
                                </Typography>
                            </Divider>
                        </Grid>
                        <Grid xs={12}>
                            {
                                !sectionIsLoading ?
                                    !section.link ?
                                        <>
                                            <Typography component="p" variant="body1">
                                                فایل جلسه را از این بخش انتخاب کنید تا آپلود شود.
                                            </Typography>
                                            <UploadBox autoUpload uploadUrl={'/upload/section/' + sectionId}
                                                       onUpload={async () => mutate()}/>
                                        </>
                                        :
                                        <>
                                            <Typography component="p" variant="body1">
                                                شما قبلا برای این جلسه یک فایل آپلود کرده اید.
                                            </Typography>
                                            <Link href={section.link}>
                                                <Button endIcon={<AttachFileIcon fontSize={'large'}/>}>
                                                    دانلود فایل
                                                </Button>
                                            </Link>
                                        </>
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
                        </Grid>
                        <Grid xs={12}>
                            <Typography component="p" variant="body1">
                                برای تعیین و مدیریت تکلیف جلسه، میتوانید از بخش زیر اقدام کنید.
                            </Typography>
                            <RouterLink to={'./homeworks'}>
                                <Button>
                                    تکلیف جلسه
                                </Button>
                            </RouterLink>
                        </Grid>
                    </Grid>
                    <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    ویرایش اطلاعات
                                </Typography>
                            </Divider>
                        </Grid>
                        <UpdateSectionInfo sectionId={sectionId} section={section} sectionIsLoading={sectionIsLoading}/>
                    </Grid>
                </Grid>

            </Container>
        </Box>
    );
}

export default CreateSection;