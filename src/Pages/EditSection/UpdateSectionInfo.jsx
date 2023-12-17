import Grid from "@mui/material/Unstable_Grid2";
import {Alert, Snackbar, TextField} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Api from "../../Api/Api";
import {useEffect, useState} from "react";

function UpdateSectionInfo({sectionId, section, sectionIsLoading}) {
    useEffect(() => {
        if (!sectionIsLoading) {
            setTitle(section.title);
            setDescription(section.descriptions);
            setScore(section.score)
        }
    }, [section]);

    // Inputs
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [score, setScore] = useState(0);


    // Error Handing
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [scoreError, setScoreError] = useState('');

    // Other
    const [createSectionLoading, setCreateSectionLoading] = useState(false);

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

        let data = {
            title: title,
            descriptions: description,
            score: score,
        };

        try {
            setCreateSectionLoading(true);
            const response = await Api.post('/upd/section/' + sectionId, data);
            setCreateSectionLoading(false);
            if (response.status === 200) {
                if (response.data.res === 200) {
                    setSnackbarStatus({
                        open: true,
                        type: 'success',
                        message: 'جلسه جدید با موفقیت ویرایش شد.'
                    });
                } else {
                    setSnackbarStatus({
                        open: true,
                        type: 'error',
                        message: response.data.error
                    });
                }
            }
        } catch (error) {
            setCreateSectionLoading(false);
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
        if (handleScoreError(score)) error = true;
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
        <>
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
                >
                </TextField>
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
                    loading={createSectionLoading}
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
            <Snackbar
                open={snackbarStatus.open}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}>
                <Alert severity={snackbarStatus.type} sx={{width: '100%'}}>
                    {snackbarStatus.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default UpdateSectionInfo;