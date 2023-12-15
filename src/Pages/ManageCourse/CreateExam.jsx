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
import userContext from "../../Contexts/UserContext";
import UploadBox from "../../Components/UploadBox";
import LinearProgressWithLabel from "../../Components/LinearProgressWithLabel";

function CreateExam({courseId, onExamCreate}) {
    // Inputs
    const [maxScore, setMaxScore] = useState(20);
    const [passingScore, setPassingScore] = useState(12);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    // Error Handing
    const [maxScoreError, setMaxScoreError] = useState('');
    const [passingScoreError, setPassingScoreError] = useState('');
    const [fileError, setFileError] = useState('');
    const [uploadStatus, setUploadStatus] = useState('primary');

    // Other
    const [createExamLoading, setCreateExamLoading] = useState(false);
    const user = useContext(userContext);

    // Snackbar
    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        type: 'error',
        message: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();
        if (handleFormError())
            return;

        const data = {
            maxScore,
            passingScore,
            courseId,
            teacherId: user.current.appBarUser.teacher.id,
            file: file
        };
        
        try {
            setUploadStatus('primary')
            setCreateExamLoading(true);
            let config = {
                onUploadProgress: progressEvent => {
                    let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            }

            const response = await Api.post('/newExam', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                ...config
            });

            setCreateExamLoading(false);
            if (response.status === 200) {
                if (response.data.res === 200) {
                    setSnackbarStatus({
                        open: true,
                        type: 'success',
                        message: 'امتحان جدید با موفقیت اضافه شد.'
                    });
                    setUploadStatus('success');
                    onExamCreate();
                } else {
                    setSnackbarStatus({
                        open: true,
                        type: 'error',
                        message: response.data.error
                    });
                    setUploadStatus('error');
                }
            }
        } catch (error) {
            setUploadStatus('error');
            setCreateExamLoading(false);
            setSnackbarStatus({
                open: true,
                type: 'error',
                message: 'در ارتباط با سرور مشکلی پیش آمده است.'
            });
        }
    }

    function handleFormError() {
        let error = false;
        if (handleMaxScoreError(maxScore)) error = true;
        if (handlePassingScoreError(passingScore)) error = true;
        if (handleFileError(file)) error = true;
        return error;
    }

    function handleMaxScoreError(value) {
        const valid = !/^\s*$/.test(value) && !isNaN(value);
        if (valid) {
            setMaxScoreError('');
            return false;
        } else {
            setMaxScoreError('لطفا امتیار معتبر وارد کنید.');
            return true;
        }
    }

    function handleFileError(value) {
        if (!value) {
            setFileError('لطفا یک فایل برای امتحان انتخاب کنید.');
            return true;
        } else {
            setFileError('');
            return false;
        }
    }

    function handlePassingScoreError(value) {
        const valid = !/^\s*$/.test(value) && !isNaN(value);
        if (valid) {
            setPassingScoreError('');
            return false;
        } else {
            setPassingScoreError('لطفا امتیار معتبر وارد کنید.');
            return true;
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
            <Typography component="h3" variant="subtitle1">
                ایجاد امتحان جدید
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onBlur={(e) => handlePassingScoreError(e.target.value)}
                            error={maxScoreError !== ''}
                            helperText={maxScoreError}
                            placeholder={'حداکثر امتیاز'}
                            label={'حداکثر امتیاز'}
                            value={maxScore}
                            onChange={(e) => {
                                setMaxScore(e.target.value);
                                handlePassingScoreError(e.target.value);
                            }}
                            type={"number"}
                            required
                        >
                        </TextField>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onBlur={(e) => handlePassingScoreError(e.target.value)}
                            error={passingScoreError !== ''}
                            helperText={passingScoreError}
                            placeholder={'امتیاز قبولی'}
                            label={'امتیاز قبولی'}
                            value={passingScore}
                            onChange={(e) => {
                                setPassingScore(e.target.value);
                                handlePassingScoreError(e.target.value);
                            }}
                            type={"number"}
                            required
                        >
                        </TextField>
                    </Grid>
                    <Grid xs={12}>
                        <UploadBox
                            onFileSelect={(file) => setFile(file)}
                            textFieldProps={{
                                helperText: fileError,
                                error: fileError !== ''
                            }}
                        />
                        {
                            createExamLoading &&
                            <Box sx={{mt: 1}}>
                                <LinearProgressWithLabel value={progress} color={uploadStatus}/>
                            </Box>
                        }
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                        <LoadingButton
                            loading={createExamLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ایجاد امتحان
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

export default CreateExam;