import {
    Alert, Box,
    Checkbox,
    Container, FormControl, FormControlLabel, InputAdornment,
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
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import UploadBox from "../../Components/UploadBox";

function CreateHomeWork() {
    // Inputs
    const [title, setTitle] = useState('');
    const [score, setScore] = useState(0);
    const [maxTime, setMaxTime] = useState(1);
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');

    // Error Handing
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [scoreError, setScoreError] = useState('');

    // Other
    const [createHomeWorkLoading, setCreateHomeWorkLoading] = useState(false);

    // Snackbar
    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        type: 'error',
        message: ''
    });

    const {courseId, sectionId} = useParams();
    const setAppSnackbarStatus = useOutletContext()[1];


    const user = useContext(UserContext);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (handleFormError())
            return;

        let data = {
            title: title,
            description: description,
            score: score,
            maxTime,
            sectionId: sectionId,
            courseId: courseId,
            fileId: setFile

        };
        try {
            setCreateHomeWorkLoading(true);
            const response = await Api.post('/newHomework', data);
            setCreateHomeWorkLoading(false);
            if (response.status === 200) {
                if (response.data.res === 200) {
                    setAppSnackbarStatus({
                        open: true,
                        type: 'success',
                        message: 'تکلیف جدید با موفقیت ایجاد شد.'
                    });
                    navigate('/teachers/courses/' + courseId + '/sections/'); //+ sectionId
                } else {
                    setSnackbarStatus({
                        open: true,
                        type: 'error',
                        message: response.data.error
                    });
                }
            }
        } catch (error) {
            setCreateHomeWorkLoading(false);
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

    function handleScoreError(value) {
        const valid = !/^\s*$/.test(value) && !isNaN(value);
        if (valid) {
            setScoreError('');
            return false;
        } else {
            setScoreError('لطفا امتیار معتبر وارد کنید.');
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
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                ایجاد تکلیف جدید
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
                            fullWidth
                            onBlur={(e) => handleScoreError(e.target.value)}
                            error={scoreError !== ''}
                            helperText={scoreError}
                            placeholder={'امتیاز'}
                            label={'امتیاز'}
                            value={score}
                            onChange={(e) => {
                                setScore(e.target.value);
                                handleScoreError(e.target.value);
                            }}
                            type={"number"}
                            required
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            placeholder={'روز'}
                            label={'زمان'}
                            value={maxTime}
                            onChange={(e) => {
                                setMaxTime(e.target.value);
                            }}
                            type={"number"}
                            InputProps={{
                                endAdornment: <InputAdornment position="start">روز</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <UploadBox autoUpload={true} uploadUrl={'/upload/section'}
                                   onUpload={(fileId) => setFile(fileId)}/>
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
                    <Grid xs={12} sm={6} md={4}>
                        <LoadingButton
                            loading={createHomeWorkLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ایجاد تکلیف
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

export default CreateHomeWork;