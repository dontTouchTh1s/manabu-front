import {Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography} from "@mui/material";
import React from "react";

function CourseCard({student}) {

    return (
        <Box>
            <Stack spacing={1}>
                <Avatar/>
                <Box sx={{pl: 2}}>
                    <Typography component="p" variant="subtitle1">
                        {student.user.fName + ' ' + student.user.lName}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
}

export default CourseCard;