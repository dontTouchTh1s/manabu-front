import {
    Box, Checkbox,
    Container,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography,
    Alert, Button
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';

import {useContext, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import Api from "../../Api/Api";
import userContext from "../../Contexts/UserContext";

function Login({onLogin = null}) {
    const navigate = useNavigate();
    const user = useContext(userContext);

    // Inputs
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Error handling
    const [otpCodeError, setOtpCodeError] = useState('');
    const [emailError, setEmailError] = useState('');

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
            otp: otpCode,
            remember_me: rememberMe
        };

        try {
            setLoginLoading(true);
            const response = await Api.post('/login', data);
            setLoginLoading(false);
            if (response.data.res === 200) {
                user.current.setNavigationMenuUser(response.data.data);
                user.current.setAppBarUser(response.data.data);
                if (onLogin)
                    onLogin();
                else {
                    setAppSnackbarStatus({
                        open: true,
                        message: 'خوش آمدید، ' + response.data.user.alias,
                        type: 'success'
                    });
                    navigate('/courses');
                }
            } else {
                setSnackbarStatus({
                    open: true,
                    type: 'error',
                    message: response.data.error
                });
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
            });
        } catch (e) {
            setOtpLoading(false);
            setSnackbarStatus({
                open: true,
                type: 'error',
                message: 'در هنگام ارتباط با سرور مشکلی پیش آمده است'
            })
        }
    }

    function handleFormError() {
        let error = false;
        if (handleEmailError(email)) error = true;
        if (handleOtpCodeError(otpCode)) error = true;

        return error;
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


    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                ورود
            </Typography>
            <Container disableGutters maxWidth={'xs'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12}>
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
                    <Grid xs={8}>
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
                    <Grid xs={4}>
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
                    <Grid xs={12}>
                        <LoadingButton
                            loading={loginLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ورود
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

export default Login;