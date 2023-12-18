import {
    Alert, Box, Button,
    Checkbox,
    Container, Divider, FormControl, FormControlLabel,
    InputLabel, MenuItem, Select, Skeleton,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import React, {useContext, useEffect, useState} from "react";
import Api from "../../Api/Api";
import UserContext from "../../Contexts/UserContext";
import moment from "moment-jalaali";
import LoadingCircle from "../../Components/LoadingCircle";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMomentJalaali} from "@mui/x-date-pickers/AdapterMomentJalaali";
import useCategories from "../../Hooks/useCategories";
import {Link, useParams} from "react-router-dom";
import '../../Themes/custom-scrollbar.css';
import useSWRImmutable from "swr/immutable";
import SectionSkeleton from "../ManageSections/SectionSkeleton";
import SectionsCard from "../ManageSections/SectionsCard";
import NotDataBox from "../../Components/NotDataBox";
import CreateExam from "./CreateExam";
import StudentCard from "./StudentCard";
import useCourseSections from "../../Hooks/useCourseSections";
import useCourse from "../../Hooks/useCourse";
import useExam from "../../Hooks/useExam";
import ShowExam from "./ShowExam";
import HandleExam from "./HandleExam";
import ChatBox from "../../Components/ChatBox/ChatBox";

async function studentsFetcher(url) {
    return Api.get(url).then(response => response.data.users);
}


function ManageCourse() {
    const {courseId} = useParams();
    const [chatBoxIsOpen, setChatBoxIsOpen] = useState(false);
    const [currentChatUser, setCurrentChatUser] = useState(null);

    const {
        course,
        courseIsLoading
    } = useCourse(courseId);

    useEffect(() => {
        if (!courseIsLoading) {
            setTitle(course.title);
            setIsOnline(course.isOnline);
            setStartAt(moment(course.startAt));
            setDescription(course.descriptions);
            setCategoryId(course.category.id);
            setPrerequisite(course.perquisites ?? '');
        }
    }, [courseIsLoading]);

    // Inputs
    const [title, setTitle] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const [startAt, setStartAt] = useState(moment());
    const [description, setDescription] = useState('');
    const [prerequisite, setPrerequisite] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Error Handing
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    // Other
    const [createCourseLoading, setCreateCourseLoading] = useState(false);

    // Snackbar
    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        type: 'error',
        message: ''
    });

    const {
        categories: categoriesIds,
        categoriesIsLoading: categoriesIsLoading
    } = useCategories();

    const {sections, sectionsIsLoading} = useCourseSections(courseId);

    const {
        data: students,
        isLoading: studentsIsLoading
    } = useSWRImmutable('/teacherCourses/' + courseId + '/4/0', studentsFetcher, {revalidateOnMount: true});

    const user = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();
        if (handleFormError())
            return;

        let data = {
            title: title,
            descriptions: description,
            isOnline: isOnline,
            startAt: startAt,
            instituteId: null,
            teacherId: user.current.appBarUser.teacher.id,
            perquisites: prerequisite,
            categoryId: categoryId,

        };

        try {
            setCreateCourseLoading(true);
            const response = await Api.post('/newCourse', data);
            setCreateCourseLoading(false);
            if (response.status === 200) {
                if (response.data.res === 200) {
                    setSnackbarStatus({
                        open: true,
                        type: 'success',
                        message: 'دوره جدید با موفقیت ایجاد شد.'
                    })
                } else {
                    setSnackbarStatus({
                        open: true,
                        type: 'error',
                        message: response.data.error
                    });
                }
            }
        } catch (error) {
            setCreateCourseLoading(false);
            setSnackbarStatus({
                open: true,
                type: 'error',
                message: 'در ارتباط با سرور مشکلی پیش آمده است.'
            });
        }
    }

    function handleFormError() {
        let error = false;
        if (handleTitleError(title)) error = true;
        if (handleDescriptionError(description)) error = true;
        return error;
    }

    function handleTitleError(value) {
        if (value === '') {
            setTitleError('لطفا این فیلد را پر کنید.');
            return true;
        } else {
            setTitleError('');
            return false;
        }
    }

    function handleDescriptionError(value) {
        if (value.length < 10) {
            setDescriptionError('لطفا حداقل ده کاراکتر وارد کنید.');
            return true;
        } else {
            setDescriptionError('');
            return false;
        }
    }

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarStatus({...snackbarStatus, open: false});
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                مدیریت دوره
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
                            {
                                !sectionsIsLoading ?
                                    sections.length !== 0 ?
                                        sections.map(sec =>
                                            <Grid key={sec.id} xs={12} sm={6} md={4}>
                                                <SectionsCard section={sec}/>
                                            </Grid>) :
                                        <Grid xs={12}>
                                            <NotDataBox height={'170x'}>
                                                <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                                                    {'موردی یافت نشد!'}
                                                </Typography>
                                            </NotDataBox>
                                        </Grid>
                                    : <>
                                        <Grid>
                                            <SectionSkeleton/>
                                        </Grid>
                                        <Grid>
                                            <SectionSkeleton/>
                                        </Grid>
                                    </>
                            }
                        </Grid>
                        <Grid xs={12}>
                            <Link to={'./sections'}>
                                <Button variant={'text'}>
                                    مدیریت همه جلسات
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid xs={12} container>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    دانشجویان
                                </Typography>
                            </Divider>
                        </Grid>
                        <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                            <Grid xs={12}>
                                <Typography component={'p'} variant={'body1'} color={'unImportant.main'}>
                                    برای شروع گفت و گو میتوانید روی دانشجویان کلیک کنید.
                                </Typography>
                            </Grid>
                            {
                                !studentsIsLoading ?
                                    students.length !== 0 ?
                                        students.map(std =>
                                            <Grid key={std.id} xs={6} sm={4} md={3}
                                                  onClick={() => {
                                                      setCurrentChatUser(std.user);
                                                      setChatBoxIsOpen(true);
                                                  }}
                                                  sx={{cursor: 'pointer'}}>
                                                <StudentCard student={std}/>
                                            </Grid>) :
                                        <Grid xs={12}>
                                            <NotDataBox height={'170x'}>
                                                <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                                                    {'موردی یافت نشد!'}
                                                </Typography>
                                            </NotDataBox>
                                        </Grid>
                                    : <>
                                        <Grid>
                                            <SectionSkeleton/>
                                        </Grid>
                                        <Grid>
                                            <SectionSkeleton/>
                                        </Grid>
                                    </>
                            }
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            {
                                currentChatUser &&
                                <ChatBox
                                    teacher={{user: user.current.appBarUser, id: user.current.appBarUser.id}}
                                    user={currentChatUser}
                                    isOpen={chatBoxIsOpen} forTeacher onChange={(v) => setChatBoxIsOpen(v)}/>
                            }
                            <Link to={'./chat-room'}>
                                <Button variant={'contained'}>
                                    چت با همه دانشجویان دوره
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
                    <Grid xs={12} container>
                        <Grid xs={12}>
                            <Divider sx={{width: '100%'}} variant={'fullWidth'} textAlign={'left'}>
                                <Typography component="p" variant="h6">
                                    اطلاعات
                                </Typography>
                            </Divider>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField
                                onBlur={(e) => handleTitleError(e.target.value)}
                                error={titleError !== ''}
                                helperText={titleError}
                                required
                                fullWidth
                                label="عنوان"
                                autoFocus
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    handleTitleError(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value === '')
                                        setPrerequisite('بدون پیش نیاز');
                                }}
                                fullWidth
                                label="پیش نیاز ها"
                                value={prerequisite}
                                onFocus={(e) => {
                                    if (e.target.value === 'بدون پیش نیاز')
                                        setPrerequisite('');
                                }}
                                onChange={(e) => {
                                    setPrerequisite(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id={'category-label'}>دسته بندی</InputLabel>
                                <Select
                                    autoWidth
                                    labelId={'category-label'}
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    label={'دسته بندی'}
                                    required
                                >
                                    {
                                        !categoriesIsLoading ?
                                            categoriesIds.map(ctg =>
                                                <MenuItem key={ctg.id} value={ctg.id} selected>{ctg.faName}</MenuItem>
                                            ) :
                                            !courseIsLoading ?
                                                <MenuItem key={course.category.id}
                                                          value={course.category.id}>{course.category.faName}</MenuItem>
                                                :
                                                <LoadingCircle/>


                                    }

                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterMomentJalaali}>
                                <DatePicker
                                    sx={{width: '100%'}}
                                    label={'تاریخ شروع'}
                                    value={startAt}
                                    onChange={(newValue) => setStartAt(newValue)}/>
                            </LocalizationProvider>
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                onBlur={(e) => handleDescriptionError(e.target.value)}
                                error={descriptionError !== ''}
                                helperText={descriptionError}
                                placeholder={'توضیحات'}
                                label={'توضیحات'}
                                multiline
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    handleDescriptionError(e.target.value);
                                }}
                                minRows={4}
                                maxRows={5}
                                required
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={12}>
                            <FormControlLabel
                                label={'آنلاین'}
                                control={
                                    <Checkbox
                                        checked={isOnline}
                                        onChange={(e) => {
                                            setIsOnline(e.target.checked)
                                        }}
                                    />}
                            >
                            </FormControlLabel>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <LoadingButton
                                loading={createCourseLoading}
                                type="submit"
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                            >
                            <span>
                            ثبت
                            </span>
                            </LoadingButton>
                        </Grid>
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
        </Box>
    );
}

export default ManageCourse;