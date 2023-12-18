import {useNavigate} from "react-router-dom";
import Api from "../../Api/Api";
import {
    Box, Checkbox,
    Container, FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment, InputLabel, MenuItem, Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {Alert} from "@mui/lab";
import {useContext, useEffect, useState} from "react";

function EditProfile() {
    // Form inputs
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alias, setAlias] = useState('');
    const [gender, setGender] = useState('MAN');
    const [mobile, setMobile] = useState('');
    const [birthdate, setBirthdate] = useState(null);

    // Error handling
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [aliasError, setAliasError] = useState('');
    const [mobileError, setMobileError] = useState('');

    // Other
    const [loginLoading, setLoginLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('error');

    useEffect(() => {
        fetchUser();
    }, [])

    async function fetchUser() {
        let response = await Api.get('/myProfile');
        setAlias(response.data.user.alias);
        setFirstName(response.data.user.fName);
        setLastName(response.data.user.lName);
        setGender(response.data.user.gender);
        setEmail(response.data.user.email);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (handleFormError())
            return;

        let data = {
            fName: firstName,
            lName: lastName,
            alias: alias,
            gender: gender,
            email: email,
            mobile: mobile,
            birthdate: birthdate
        };

        try {
            setLoginLoading(true);
            const response = await Api.put('/myInfo', data);
            setLoginLoading(false);
            if (response.data.res === 200) {
                setSnackbarType('success');
                setSnackbarOpen(true);
                setSnackbarMessage('عملیات با موفقیت انجام شد.');
            } else {
                setSnackbarType('error');
                setSnackbarOpen(true);
                setSnackbarMessage(response.data.msg);
            }

        } catch (error) {
            setSnackbarType('error');
            setLoginLoading(false);
            setSnackbarOpen(true);
            setSnackbarMessage('در هنگام دریافت اطلاعات مشکلی پیش آمده است.');
        }
    }

    function handleFormError() {

        let error = false;
        if (handleEmailError(email)) error = true;
        if (handleMobileError(mobile)) error = true;
        if (handleFirstNameError(firstName)) error = true;
        if (handleLastNameError(lastName)) error = true;
        if (handleAliasError(alias)) error = true;

        return error;
    }

    function handleAliasError(value) {
        if (value.length < 3) {
            setAliasError('لطفا این فیلد را پر کنید.');
            return true;
        } else {
            setAliasError('');
            return false;
        }
    }

    function handleFirstNameError(value) {
        let regex = /^[\u0600-\u06FF\s]+$/;
        if (!regex.test(value)) {
            setFirstNameError('لطفا یک نام معتبر وارد کنید.');
            return true;
        } else {
            setFirstNameError('');
            return false;
        }
    }

    function handleMobileError(value) {
        const regex = new RegExp('^(\\+98|0)?9\\d{9}$');
        if (regex.test(value)) {
            setMobileError('');
            return false;
        } else {
            setMobileError('لطفا شماره موبایل معتبر وارد کنید.');
            return true;
        }
    }

    function handleLastNameError(value) {
        let regex = /^[\u0600-\u06FF\s]+$/;
        if (!regex.test(value)) {
            setLastNameError('لطفا یک نام خانوادگی معتبر وارد کنید.');
            return true;
        } else {
            setLastNameError('');
            return false;
        }
    }

    function handleEmailError(value) {
        if (value === '') {
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

        setSnackbarOpen(false);
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                ویرایش پروفایل
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleFirstNameError(e.target.value)}
                            error={firstNameError !== ''}
                            helperText={firstNameError}
                            required
                            fullWidth
                            label="نام"
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                handleFirstNameError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleLastNameError(e.target.value)}
                            error={lastNameError !== ''}
                            helperText={lastNameError}
                            required
                            fullWidth
                            label="نام خانوادگی"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                handleLastNameError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleAliasError(e.target.value)}
                            error={aliasError !== ''}
                            helperText={aliasError}
                            required
                            fullWidth
                            label="نام مستعار"
                            value={alias}
                            onChange={(e) => {
                                setAlias(e.target.value);
                                handleAliasError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id={'gender-label'}>جنسیت</InputLabel>
                            <Select
                                autoWidth
                                labelId={'gender-label'}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                label={'جنسیت'}
                            >
                                <MenuItem value={'MAN'} selected>مرد</MenuItem>
                                <MenuItem value={'WOMAN'}>زن</MenuItem>
                            </Select>
                        </FormControl>
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
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleEmailError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleMobileError(e.target.value)}
                            error={mobileError !== ''}
                            helperText={mobileError}
                            required
                            fullWidth
                            label="شماره تماس"
                            type={'tel'}
                            value={mobile}
                            onChange={(e) => {
                                setMobile(e.target.value);
                                handleMobileError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={5} md={3}>
                        <LoadingButton
                            loading={loginLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ویرایش
                            </span>
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}>
                <Alert severity={snackbarType} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EditProfile;