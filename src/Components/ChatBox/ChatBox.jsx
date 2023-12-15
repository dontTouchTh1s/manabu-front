import {Box, Button, Fab, IconButton, InputAdornment, Modal, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";
import ChatIcon from "@mui/icons-material/Chat";
import Message from "./Message";
import SendIcon from '@mui/icons-material/Send';
import io from "socket.io-client";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};
let socket;

function ChatBox({teacherId, userId}) {
    const [open, setOpen] = useState(true);
    const [currentMessage, setCurrentMessage] = useState('');

    function handleClose() {
        setOpen(false);
    }

    function handleStartChat() {
        socket = io.connect('http://localhost:8080/api/chat');
    }

    async function sendMessage() {
        if (currentMessage !== '') {

            const messageData = {
                teacherId: teacherId,
                userId: userId,
                content: currentMessage
            };
            console.log(messageData);
            await socket.emit('createMsg', JSON.stringify(messageData));

        }
    }

    return (
        <>
            <Fab color="primary" variant={'extended'} aria-label="گفت و گو با استاد"
                 sx={{position: 'fixed', bottom: 78}}
                 onClick={() => setOpen(!open)}
            >
                <ChatIcon/>
                <Typography component={'span'} variant={'body1'} sx={{ml: 1}}>
                    چت با استاد
                </Typography>
            </Fab>
            <Modal open={open}
                   onClose={handleClose}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack spacing={1}>
                        <Stack spacing={1}>
                            <Message/>
                            <Message me/>
                            <Message/>
                        </Stack>

                        <TextField
                            placeholder={'متن پیام'}
                            fullWidth
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="start"
                                            onClick={sendMessage}
                                            disabled={currentMessage === ''}
                                        >
                                            <SendIcon color={'primary'} sx={{transform: 'scaleX(-1)'}}/>
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                        <Button variant={'contained'} onClick={handleStartChat}>
                            شروع گفت و گو
                        </Button>
                    </Stack>
                </Box>


            </Modal>
        </>
    );
}

export default ChatBox;