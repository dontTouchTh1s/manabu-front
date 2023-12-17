import {Avatar, Box, Button, Card, CardContent, IconButton, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import GradingIcon from '@mui/icons-material/Grading';
import DoneIcon from '@mui/icons-material/Done';
import IconBox from "../../Components/IconBox";
import Grid from "@mui/material/Unstable_Grid2";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Api from "../../Api/Api";
import {Image} from "@mui/icons-material";
import Link from "@mui/material/Link";


function ShowExam({exam}) {
    const [file, setFile] = useState(null);

    async function handleDownload() {
        console.log(exam);
        const response = await Api.get('/exams/download/' + exam.file.id + '/' + exam.file.format);
        console.log(response)
        
    }


    return (
        <Card>
            <CardContent>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={6}>
                        <Stack spacing={1}>
                            <IconBox>
                                <GradingIcon color={'unImportant'}/>
                                <Typography component="p" variant="subtitle1">
                                    {'حداکثر نمره: '}
                                    {exam.maxScore}
                                </Typography>
                            </IconBox>
                            <IconBox>
                                <DoneIcon color={'unImportant'}/>
                                <Typography component="p" variant="subtitle1">
                                    {'نمره قبولی: '}
                                    {exam.passingScore}
                                </Typography>
                            </IconBox>
                        </Stack>
                    </Grid>
                    <Grid xs={6}>
                        {
                            exam.file &&
                            <>
                                <Button endIcon={<AttachFileIcon fontSize={'large'}/>} onClick={handleDownload}>
                                    دانلود فایل
                                </Button>
                                <Link
                                    href={'http://localhost:8080/manabu/exams/download/' + exam.file.id + '/' + exam.file.format}>
                                    <Box component={'img'} alt={'فایل امتحان'} sx={{maxWidth: '200px'}}
                                         src={'http://localhost:8080/manabu/exams/download/' + exam.file.id + '/' + exam.file.format}/>
                                </Link>
                            </>
                        }
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

}

export default ShowExam;