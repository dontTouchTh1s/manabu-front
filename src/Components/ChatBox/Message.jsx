import {Box, Stack, Typography} from "@mui/material";
import moment from "moment-jalaali";
import toPersianNumber from "../../Functions/ToPersianNumber";
import IconBox from "../IconBox";
import DoneIcon from "@mui/icons-material/Done";
import React, {useEffect, useRef} from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';

function Message({message, innerRef}) {
    const lastRef = useRef();
    useEffect(() => {
        lastRef.current.scrollIntoView();
    }, []);

    return (
        <Stack>
            <Typography component={'span'} variant={'body1'} textAlign={message.isMine ? 'left' : 'right'}
                        ref={innerRef}>
                {message.content}
            </Typography>
            <IconBox sx={{justifyContent: message.isMine ? 'left' : 'right'}} ref={lastRef}>
                {
                    message.isMine && (
                        message.isReceived ?
                            <DoneAllIcon color={'unImportant'} fontSize={'small'}/> :
                            <DoneIcon color={'unImportant'} fontSize={'small'}/>)
                }
                <Typography component={'span'} variant={'body2'} textAlign={message.isMine ? 'left' : 'right'}>
                    {toPersianNumber(message.date ? moment(message.date).format('HH:mm') : moment().format('HH:mm'))}
                </Typography>
            </IconBox>
        </Stack>
    );
}

export default Message;