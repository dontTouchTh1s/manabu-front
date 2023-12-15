import {useNavigate, useOutletContext} from "react-router-dom";
import Api from "../../Api/Api";
import {
    Alert,
    Box, Checkbox,
    Container, FormControl, FormControlLabel,
    InputLabel, MenuItem, Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import {useState} from "react";
import LoadingCircle from "../../Components/LoadingCircle";
import useCategories from "../../Hooks/useCategories";

function CreateTeacher() {
    const navigate = useNavigate();
    // Form inputs
    const [email, setEmail] = useState('');
    const [resume, setResume] = useState('');
    const [phone, setPhone] = useState('');
    const [degree, setDegree] = useState('');
    const [description, setDescription] = useState('');
    const [online, setOnline] = useState(false);
    const [categoryId, setCategoryId] = useState([]);
    const [inputCategoryId, setInputCategoryId] = useState([]);

    // Error handling
    const [resumeError, setResumeError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [degreeError, setDegreeError] = useState('');
    const [emailError, setEmailError] = useState('');

    // Other
    const [createLoading, setCreateLoading] = useState(false);

    // Snackbar
    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        type: 'error',
        message: ''
    });

    const setAppSnackbarStatus = useOutletContext()[1];

    const {
        categories: categoriesIds,
        categoriesIsLoading: categoriesLoading
    } = useCategories();

    async function handleSubmit(e) {
        e.preventDefault();
        if (handleFormError())
            return;

        let data = {
            email: email,
            resume: resume,
            categoryId: categoryId,
            phone: phone,
            degree: degree,
            online: online,
            description: description,

        };

        try {
            setCreateLoading(true);
            const response = await Api.post('/new/teacher', data);
            setCreateLoading(false);
            if (response.data.res === 200) {
                setAppSnackbarStatus({
                    open: true,
                    message: 'ثبت نام شما با موفقیت انجام شد، ازین پس میتوانید دوره های آموزشی ایجاد کنید.',
                    type: 'success'
                });
                navigate('/courses');
            } else {
                setSnackbarStatus({
                    open: true,
                    type: 'error',
                    message: response.data.error
                });
            }
        } catch (error) {
            setCreateLoading(false);
            setSnackbarStatus({
                open: true,
                type: 'error',
                message: 'در هنگام دریافت اطلاعات مشکلی پیش آمده است.'
            });
        }
    }

    function handleFormError() {

        let error = false;
        if (handleResumeError(resume)) error = true;
        if (handlePhoneError(phone)) error = true;


        return error;
    }

    function handleResumeError(value) {
        if (value.length < 3) {
            setResumeError('لطفا حداقل 10 کاراکتر وارد کنید.');
            return true;
        } else {
            setResumeError('');
            return false;
        }
    }

    function handlePhoneError(value) {
        const regex = new RegExp('^(\\+98|0)?9\\d{9}$');
        if (regex.test(value)) {
            setPhoneError('');
            return false;
        } else {
            setPhoneError('لطفا شماره موبایل معتبر وارد کنید.');
            return true;
        }
    }

    function handleEmailError(value) {
        const regex = new RegExp('^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
        if (!regex.test(value)) {
            setEmailError('یک ایمیل معتبر وارد کنید.');
            return true;
        } else {
            setEmailError('');
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
                ثبت نام
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id={'category-label'}>دسته بندی</InputLabel>
                            <Select
                                sx={{width: '100%'}}
                                labelId={'category-label'}
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                label={'دسته بندی'}
                                required
                            >
                                {
                                    !categoriesLoading ?
                                        categoriesIds.map(ctg =>
                                            <MenuItem key={ctg.id}
                                                      value={ctg.id}>{ctg.faName}</MenuItem>
                                        ) : <LoadingCircle/>
                                }

                            </Select>
                        </FormControl>
                        {/*<Autocomplete*/}
                        {/*    multiple*/}
                        {/*    fullWidth*/}
                        {/*    value={categoryId}*/}
                        {/*    onChange={(event, newValue) => {*/}
                        {/*        setCategoryId(newValue);*/}
                        {/*    }}*/}
                        {/*    inputValue={inputCategoryId}*/}
                        {/*    onInputChange={(event, newInputValue) => {*/}
                        {/*        setInputCategoryId(newInputValue);*/}
                        {/*    }}*/}
                        {/*    getOptionLabel={(option) => option.faName}*/}
                        {/*    renderOption={(props, option, {selected}) => (*/}
                        {/*        <li {...props}>*/}
                        {/*            <Checkbox*/}
                        {/*                style={{marginRight: 8}}*/}
                        {/*                checked={selected}*/}
                        {/*            />*/}
                        {/*            {option.faName}*/}
                        {/*        </li>*/}
                        {/*    )}*/}
                        {/*    label={'دسته بندی'}*/}
                        {/*    required*/}
                        {/*    options={categoriesLoading ? [] : categoriesIds}*/}
                        {/*    renderInput={(params) => (*/}
                        {/*        <TextField*/}
                        {/*            {...params}*/}
                        {/*            label="دسته بندی"*/}
                        {/*            placeholder="دسته بندی"*/}
                        {/*        />*/}
                        {/*    )}>*/}
                        {/*</Autocomplete>*/}
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id={'degree-label'}>رتبه</InputLabel>
                            <Select
                                autoWidth
                                labelId={'degree-label'}
                                value={degree}
                                onChange={(e) => setDegree(e.target.value)}
                                label={'رتبه'}
                                required
                            >
                                <MenuItem value={'STUDENTS'}>{'دانشجو'}</MenuItem>
                                <MenuItem value={'DIPLOMA'}>{'دیپلم'}</MenuItem>
                                <MenuItem value={'BACHELOR'}>{'کارشناسی'}</MenuItem>
                                <MenuItem value={'MASTER'}>{'استاد'}</MenuItem>
                                <MenuItem value={'PHD'}>{'دکتر'}</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handlePhoneError(e.target.value)}
                            error={phoneError !== ''}
                            helperText={phoneError}
                            required
                            fullWidth
                            label="شماره تماس"
                            type={'tel'}
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                handlePhoneError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            type="email"
                            onBlur={(e) => handleEmailError(e.target.value)}
                            error={emailError !== ''}
                            helperText={emailError}
                            required
                            fullWidth
                            label="ایمیل"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleEmailError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            helperText={resumeError}
                            label={'توضیحات'}
                            multiline
                            minRows={2}
                            maxRows={2}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                        >
                        </TextField>
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            onBlur={(e) => handleResumeError(e.target.value)}
                            error={resumeError !== ''}
                            helperText={resumeError}
                            label={'رزومه'}
                            multiline
                            value={resume}
                            onChange={(e) => {
                                setResume(e.target.value);
                                handleResumeError(e.target.value);
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
                                    checked={online}
                                    onChange={(e) => {
                                        setOnline(e.target.checked)
                                    }}
                                />}
                        >
                        </FormControlLabel>
                    </Grid>
                    <Grid xs={12} sm={5} md={3}>
                        <LoadingButton
                            loading={createLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ثبت نام
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

export default CreateTeacher;