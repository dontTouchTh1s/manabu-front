import {
    Alert, Box,
    Checkbox,
    Container, FormControl, FormControlLabel,
    InputLabel, MenuItem, Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import {useContext, useState} from "react";
import Api from "../../Api/Api";
import UserContext from "../../Contexts/UserContext";
import moment from "moment-jalaali";
import LoadingCircle from "../../Components/LoadingCircle";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMomentJalaali} from "@mui/x-date-pickers/AdapterMomentJalaali";
import useCategories from "../../Hooks/useCategories";
import {useNavigate, useOutletContext} from "react-router-dom";

function CreateCourse() {
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

    const setAppSnackbarStatus = useOutletContext()[1];


    const {
        categories: categoriesIds,
        categoriesIsLoading: categoriesIsLoading
    } = useCategories();

    const user = useContext(UserContext);
    const navigate = useNavigate();

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
                    setAppSnackbarStatus({
                        open: true,
                        type: 'success',
                        message: 'دوره جدید با موفقیت ایجاد شد.'
                    });
                    navigate('/teachers/courses');
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
                ایجاد دوره جدید
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
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
                                        ) : <LoadingCircle/>
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
                            ایجاد دوره
                            </span>
                        </LoadingButton>
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

export default CreateCourse;