import {useNavigate, useOutletContext} from "react-router-dom";
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
import {useContext, useState} from "react";
import userContext from "../../Contexts/UserContext";

function Register() {
    const user = useContext(userContext);
    const navigate = useNavigate();
    // Form inputs
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alias, setAlias] = useState('');
    const [gender, setGender] = useState('MAN');
    const [rememberMe, setRememberMe] = useState(false);

    // Error handling
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [otpCodeError, setOtpCodeError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [aliasError, setAliasError] = useState('');

    // Other
    const [loginLoading, setLoginLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);


    // Snackbar
    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        type: 'error',
        message: ''
    });

    const setAppSnackbarStatus = useOutletContext()[1];

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
            otp: otpCode,
            remember_me: rememberMe
        };

        try {
            setLoginLoading(true);
            const response = await Api.post('/register', data);
            setLoginLoading(false);
            if (response.status === 200) {
                if (response.data.res === 200) {
                    user.current.setNavigationMenuUser(response.data.data);
                    user.current.setAppBarUser(response.data.data);
                    setAppSnackbarStatus({
                        open: true,
                        message: 'ثبت نام شما با موفقیت انجام شده، به حساب کاربری منتقل می شوید.',
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
            }
        } catch (error) {
            setLoginLoading(false);
            setSnackbarStatus({
                open: true,
                type: 'error',
                message: 'در هنگام دریافت اطلاعات مشکلی پیش آمده است.'
            });
        }
    }

    function handleFormError() {

        let error = false;
        if (handleEmailError(email)) error = true;
        if (handleOtpCodeError(otpCode)) error = true;
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
        const regex = new RegExp('^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
        if (!regex.test(value)) {
            setEmailError('یک ایمیل معتبر وارد کنید.');
            return true;
        } else {
            setEmailError('');
            return false;
        }
    }

    function handleOtpCodeError(value) {
        if (value.length !== 5) {
            setOtpCodeError('کد تایید 5 رقم است');
            return true;
        } else {
            setOtpCodeError('');
            return false;
        }
    }

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarStatus({...snackbarStatus, open: false});
    }

    async function handleOtpCodeSend() {
        if (handleEmailError(email)) return;
        let data = {
            email: email
        };
        try {
            setOtpLoading(true);
            await Api.post('/email/otp', data);
            setOtpLoading(false);
            setSnackbarStatus({
                open: true,
                type: 'success',
                message: 'کد تایید با موفقیت به ایمیل شما ارسال شد.'
            })
        } catch (e) {
            setOtpLoading(false);
            setSnackbarStatus({
                open: true,
                type: 'error',
                message: 'در هنگام ارتباط با سرور مشکلی پیش آمده است'
            })
        }
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                ثبت نام
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
                            autoFocus
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
                            type={'text'}
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
                    <Grid xs={8} sm={4}>
                        <TextField
                            helperText={otpCodeError}
                            error={otpCodeError !== ''}
                            required
                            fullWidth
                            label="کد تایید"
                            placeholder={'کد تایید ارسال شده به ایمیل'}
                            value={otpCode}
                            aria-required
                            onChange={(e) => {
                                setOtpCode(e.target.value);
                                handleOtpCodeError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={4} sm={2}>
                        <LoadingButton
                            loading={otpLoading}
                            sx={{height: 56}}
                            fullWidth
                            variant={'outlined'}
                            onClick={handleOtpCodeSend}
                        >
                            ارسال کد
                        </LoadingButton>
                    </Grid>
                    <Grid xs={12}>
                        <FormControlLabel
                            label={'مرا به خاطر بسپار'}
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => {
                                        setRememberMe(e.target.checked)
                                    }}
                                />}
                        >
                        </FormControlLabel>
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

export default Register;