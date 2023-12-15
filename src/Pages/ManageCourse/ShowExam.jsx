import {Avatar, Box, Card, CardContent, Stack, Typography} from "@mui/material";
import React from "react";
import GradingIcon from '@mui/icons-material/Grading';
import DoneIcon from '@mui/icons-material/Done';
import IconBox from "../../Components/IconBox";
import Grid from "@mui/material/Unstable_Grid2";
import AttachFileIcon from '@mui/icons-material/AttachFile';


function ShowExam({exam}) {
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
                        <AttachFileIcon fontSize={'large'}/>

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

}

export default ShowExam;