import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box,
    Container,
    Divider, Modal,
    Paper,
    Snackbar,
    Stack,
    Typography,
    Alert, Button, styled, Skeleton, TextField
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Api from "../../Api/Api";
import {Link, useParams} from "react-router-dom";
import GradingIcon from "@mui/icons-material/Grading";
import SchoolIcon from "@mui/icons-material/School";
import StairsOutlinedIcon from '@mui/icons-material/StairsOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import moment from "moment-jalaali";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from "@mui/lab/LoadingButton";
import {useContext, useState} from "react";
import Login from "../Auth/Login";
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import useSWRImmutable from "swr/immutable";
import toPersianNumber from "../../Functions/ToPersianNumber";
import getCookie from "../../Functions/GetCookie/GetCookie";
import IconBox from "../../Components/IconBox";
import LoadingCircle from "../../Components/LoadingCircle";
import userContext from "../../Contexts/UserContext";
import useComments from "../../Hooks/useComments";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

async function fetcher(url) {
    return Api.get(url).then(response => response.data.course);
}

function ViewCourse() {
    const [commentContent, setCommentContent] = useState('');

    // Other
    const [expanded, setExpanded] = useState(true);
    const [takeCourseLoading, setTakeCourseLoading] = useState(false);
    const [commentContentError, setCommentContentError] = useState('');

    // Snackbar
    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        type: 'error',
        message: ''
    });

    // Modal
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const {courseId} = useParams();

    const {
        data: course,
        isLoading: courseIsLoading
    } = useSWRImmutable('/course/' + courseId, fetcher, {revalidateOnMount: true, revalidateOnFocus: true})

    const {comments, commentsIsLoading} = useComments({
        take: 1000,
        skip: 0,
        target: 'courseId',
        targetId: courseId,

    });

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarStatus({...snackbarStatus, open: false});
    }

    const user = useContext(userContext);

    async function handleTakeCourse() {
        const data = {
            courseId: course.id,
            teacherId: course.teacher.id
        };
        if (getCookie(process.env.REACT_APP_AUTH_COOKIE_NAME)) {
            try {
                setTakeCourseLoading(true);
                const response = await Api.post('/registerCourse', data);
                setTakeCourseLoading(false);
                if (response.data.res === 200) {
                    setSnackbarStatus({
                        open: true,
                        type: 'success',
                        message: 'با موفقیت در دوره عضو شدید.'

                    });
                    course.registered = true;
                } else {
                    setSnackbarStatus({
                        open: true,
                        type: 'error',
                        message: response.data.error

                    });
                }
            } catch (e) {
                setTakeCourseLoading(false);
                if (e.response.data.res === 401 || e.response.data.res === 404) {
                    setLoginModalOpen(true);
                } else {
                    setSnackbarStatus({
                        open: true,
                        type: 'error',
                        message: 'در هنگام عضویت در دوره مشکلی پیش آمده است، دوباره تلاش کنید.'

                    });
                }
            }
        } else {
            setLoginModalOpen(true);
        }
    }

    async function handleOnLogin() {
        setLoginModalOpen(false);
        await handleTakeCourse();
    }

    async function handleComment(parentId = null) {
        if (commentContent === '') {
            setCommentContentError('لطفا یک متن وارد کنید.')
            return;
        } else {
            setCommentContentError('');
        }
        try {
            const data = {
                content: commentContent,
                isPublished: true,
                targetId: courseId,
                target: 'course'
            };
            await Api.post('/comment/create', data);
        } catch (e) {
            console.log(e)

        }
    }

    if (!courseIsLoading) {
        for (const u of course.student) {
            if (u.user.id === user.current.appBarUser.id)
                course.registered = true;
        }
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                دوره ها
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12}>
                        {
                            !courseIsLoading ?
                                <>
                                    <Typography component="h2" variant="h5" sx={{textAlign: 'left'}}>
                                        {course.title}
                                    </Typography>
                                    <Typography component="p" variant="subtitle1" sx={{
                                        textAlign: 'left'
                                    }}
                                                color={'unImportant.main'}>
                                        {'در تاریخ '}
                                        <Typography component="span" sx={{unicodeBidi: 'plaintext'}}>
                                            {toPersianNumber(moment(course.createdAt).format('jYYYY/jMM/jDD'))}
                                        </Typography>
                                    </Typography>
                                </> :
                                <>
                                    <Skeleton variant={'text'} width={'100%'}/>
                                    <Skeleton variant={'text'} width={'100%'}/>
                                    <Skeleton variant={'text'} width={'100%'}/>
                                </>
                        }
                    </Grid>
                    <Grid xs={12} sm={6} md={8}>
                        <Stack spacing={1}>
                            <Paper sx={{
                                display: 'flex',
                                gap: 1,
                                flexDirection: 'column',
                                p: 2
                            }}>
                                {
                                    !courseIsLoading ?
                                        <>
                                            <IconBox>
                                                <StairsOutlinedIcon/>
                                                <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                                    {'دسته بندی: '}
                                                    {course.category.faName}
                                                </Typography>
                                            </IconBox>
                                            <IconBox>
                                                <GradingIcon/>
                                                <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                                    {'پیش نیاز ها: '}
                                                    {course.prerequisite}
                                                </Typography>
                                            </IconBox>
                                            <IconBox>
                                                <LanguageOutlinedIcon/>
                                                <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                                    {'نوع برگذاری: '}
                                                    {course.isOnline ? 'آنلاین' : 'آفلاین'}
                                                </Typography>
                                            </IconBox>
                                        </> :
                                        <>
                                            <Skeleton variant={'text'} width={'100%'}/>
                                            <Skeleton variant={'text'} width={'100%'}/>
                                            <Skeleton variant={'text'} width={'100%'}/>
                                        </>
                                }
                            </Paper>
                            <Accordion
                                expanded={expanded}
                                onChange={() => setExpanded(!expanded)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header">
                                    <Typography component="h3" variant="h6" sx={{textAlign: 'left'}}>
                                        {'توضیحات'}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        !courseIsLoading ?
                                            <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                                {course.descriptions}
                                            </Typography> :
                                            <>
                                                <Skeleton variant={'text'} width={'100%'}/>
                                                <Skeleton variant={'text'} width={'100%'}/>
                                            </>


                                    }
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                expanded={expanded}
                                onChange={() => setExpanded(!expanded)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header">
                                    <Typography component="h3" variant="h6" sx={{textAlign: 'left'}}>
                                        {'نظرات'}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={{xs: 1, sm: 2}}>
                                        <Grid xs={12} container>
                                            {
                                                !commentsIsLoading && comments ?
                                                    comments.map(cm =>
                                                        <Grid xs={12}>
                                                            <Typography component="p" variant="subtitle1"
                                                                        sx={{textAlign: 'left'}}>
                                                                {cm.user.fName + ' ' + cm.user.lName}
                                                            </Typography>
                                                            <Box sx={{pl: 3}}>
                                                                <Typography component="p" variant="body1"
                                                                            sx={{textAlign: 'left'}}>
                                                                    {cm.content}
                                                                </Typography>
                                                            </Box>
                                                            <Divider/>
                                                        </Grid>
                                                    ) :
                                                    <Grid xs={12}>
                                                        <Typography component="h3" variant="body1"
                                                                    sx={{textAlign: 'left'}}>
                                                            هیچ نظری ثبت نشده است، اولین نفر باشید.
                                                        </Typography>
                                                    </Grid>

                                            }
                                        </Grid>
                                        <Grid xs={12}>
                                            <TextField
                                                fullWidth
                                                error={commentContentError !== ''}
                                                helperText={commentContentError}
                                                placeholder={'متن نظر'}
                                                label={'متن نظر'}
                                                multiline
                                                value={commentContent}
                                                onChange={(e) => {
                                                    setCommentContent(e.target.value);
                                                }}
                                                minRows={4}
                                                maxRows={5}
                                                required
                                            >
                                            </TextField>
                                        </Grid>

                                        <Grid xs={12} sm={6} md={3}>
                                            <Button onClick={handleComment} variant={'outlined'}>
                                                ثبت نظر
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Stack>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                        <Stack spacing={2}>
                            <Paper sx={{
                                p: 2
                            }}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',

                                        }}>
                                            <SchoolIcon fontSize={'large'}/>
                                            <Typography component="h2" variant="h5" sx={{textAlign: 'left'}}>
                                                {'درباره مدرس'}
                                            </Typography>
                                        </Box>
                                        {
                                            !courseIsLoading ?

                                                <Link to={'/teachers/' + course.teacher.id}>
                                                    <Button
                                                        sx={{
                                                            justifyContent: 'space-between',
                                                            '& .MuiButton-endIcon': {ml: 0, mr: 1},

                                                        }}
                                                        size={'large'}
                                                        variant={'text'}
                                                        endIcon={<FolderSharedIcon fontSize={'large'}
                                                                                   sx={{fontSize: '30px !important'}}/>}
                                                        fullWidth
                                                        color={'info'}>

                                                        <Typography component="span" variant="h6"
                                                                    sx={{textAlign: 'left'}}>
                                                            {course.teacher.user.fName + ' ' + course.teacher.user.lName}
                                                            <Typography component="span" variant="subtitle1"
                                                                        sx={{textAlign: 'left'}}>
                                                                {' (' + course.teacher.user.alias + ') '}
                                                            </Typography>

                                                        </Typography>
                                                    </Button>
                                                </Link> : <LoadingCircle/>
                                        }
                                    </Box>
                                    <Divider/>
                                    <Box>
                                        <Typography component="p" variant="h6" sx={{textAlign: 'left'}}>
                                            {'شماره تماس'}
                                        </Typography>
                                        {
                                            !courseIsLoading ?
                                                <Typography component="p" variant="body1" sx={{textAlign: 'right'}}>
                                                    {toPersianNumber(course.teacher.phone)}
                                                </Typography> :
                                                <Skeleton variant={'text'} width={'100%'}/>
                                        }
                                    </Box>
                                    <Divider/>

                                    <Box>
                                        <Typography component="p" variant="h6" sx={{textAlign: 'left'}}>
                                            {'روزمه'}
                                        </Typography>
                                        {
                                            !courseIsLoading ?
                                                <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                                    {course.teacher.resume}
                                                </Typography> :
                                                <Skeleton variant={'text'} width={'100%'}/>
                                        }
                                    </Box>
                                </Stack>
                            </Paper>
                            <Paper sx={{
                                p: 2
                            }}>
                                <Stack spacing={1}>
                                    {
                                        !courseIsLoading ?
                                            !course.registered ?
                                                user.current.appBarUser.teacher &&
                                                course.teacher.id === user.current.appBarUser.teacher.id ?
                                                    <Link to={'/teachers/courses/' + courseId}>
                                                        <Button variant={'contained'} fullWidth>
                                                            مدیریت کلاس
                                                        </Button>
                                                    </Link>
                                                    :
                                                    <LoadingButton
                                                        disabled={courseIsLoading}
                                                        fullWidth
                                                        loading={takeCourseLoading}
                                                        variant={'contained'}
                                                        startIcon={<AddCardOutlinedIcon/>}
                                                        onClick={handleTakeCourse}
                                                    >
                                                        {'شرکت در دوره'}
                                                    </LoadingButton>
                                                :
                                                <Link to={'/student/courses/' + courseId}>
                                                    <Button variant={'contained'} fullWidth>
                                                        مشاهده کلاس
                                                    </Button>
                                                </Link>
                                            :
                                            <LoadingCircle/>
                                    }
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={snackbarStatus.open}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}>
                <Alert severity={snackbarStatus.type} sx={{width: '100%'}}>
                    {snackbarStatus.message}
                </Alert>
            </Snackbar>
            <Modal

                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{...style, width: '400px'}}>
                    <Login onLogin={handleOnLogin}/>
                </Box>
            </Modal>
        </Box>
    );
}

export default ViewCourse;