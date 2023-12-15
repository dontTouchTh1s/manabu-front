import {Stack, Typography} from "@mui/material";
import moment from "moment-jalaali";
import toPersianNumber from "../../Functions/ToPersianNumber";

function Message({me = false, message = {}}) {
    return (
        <Stack>
            <Typography component={'span'} variant={'body1'} textAlign={me ? 'left' : 'right'}>
                {'test message'}
            </Typography>
            <Typography component={'span'} variant={'body2'} textAlign={me ? 'left' : 'right'}>
                {toPersianNumber(moment().format('HH:mm'))}
            </Typography>
        </Stack>
    );
}

export default Message;