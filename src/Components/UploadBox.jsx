import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    styled,
    TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import Api from "../Api/Api";

function UploadBox({autoUpload = false, onUpload, uploadUrl, onFileSelect = undefined, textFieldProps}) {
    const [fileName, setFileName] = useState('');
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [color, setColor] = useState('primary');

    async function handleSelectFile(e) {
        const files = e.target.files;
        if (files) {
            setFileName(files[0] ? files[0].name : '')
            if (onFileSelect)
                onFileSelect(files[0]);
        } else setFileName('');

        // Upload file
        if (autoUpload) {
            const fd = new FormData();
            fd.append('file', files[0]);

            try {
                setUploading(true);
                let config = {
                    onUploadProgress: progressEvent => {
                        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                }

                const response = await Api.post(uploadUrl, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    ...config
                });
                if (response.data.res === 200) {
                    onUpload(response.fileId);
                    setColor('success');
                } else {
                    setColor('error');
                }
            } catch (error) {
                setColor('error');
            }
        }
    }


    return (
        <>
            <TextField id={'fileInput'} type="file" sx={{display: 'none'}} onChange={handleSelectFile}/>
            <label htmlFor={'fileInput'}>
                <Box sx={{pointerEvents: 'none'}}>
                    <TextField
                        value={fileName}
                        fullWidth
                        title={'فایل'}
                        placeholder={'فایلی انتخاب نشده است'}
                        {...textFieldProps}
                        InputProps={{
                            readOnly: true,
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="start"
                                    >
                                        <CloudUploadIcon/>
                                    </IconButton>
                                </InputAdornment>
                        }}

                    />
                    {
                        uploading &&
                        <Box sx={{mt: 0.5}}>
                            <LinearProgressWithLabel value={progress} color={color}/>
                        </Box>
                    }

                </Box>
            </label>


        </>

    )
}

export default UploadBox;