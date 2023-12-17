import {Box, Button, Fab, IconButton, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import ChatIcon from "@mui/icons-material/Chat";
import io from "socket.io-client";
import CloseIcon from '@mui/icons-material/Close';
import Messenger from "../Chat/Messenger";

const containerStyle = {
    position: 'fixed',
    bottom: '145px',
    left: '210px',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    outline: 0
};

const style = {
    p: {xs: 1, sm: 2}
}

function ChatBox({teacher, user}) {
    const [open, setOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState(null);

    function handleStartChat() {
        setSocket(io.connect('http://localhost:8080/api/chat'));
    }

    console.log(socket)

    async function chatList(date) {
        await socket.emit('chatsList', date);
    }

    useEffect(() => {
        if (socket) {
            let data = {teacherId: teacher.id, userId: user.id};
            chatList(data);

        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on('chatsList', async (data) => {
                const myChat = data.filter(cht => cht.user.id === user.id && cht.teacher.id === teacher.id)[0];
                if (!myChat) {
                    const messageData = {
                        teacherId: teacher.id,
                        userId: user.id,
                        content: ''
                    };
                    await socket.emit('createMsg', JSON.stringify(messageData));
                }
                setChat(myChat)
            })
        }
    }, [socket]);

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
            <Box
                sx={containerStyle}
            >
                <Box sx={style} display={open ? 'block' : 'none'}>
                    <Stack spacing={1}>
                        <Box>
                            <IconButton onClick={() => setOpen(false)}>
                                <CloseIcon/>
                            </IconButton>
                            <Typography component={'span'} variant={'body1'} textAlign={'left'}>
                                {teacher.user.fName + ' ' + teacher.user.lName}
                            </Typography>
                        </Box>
                        {
                            !socket || !chat ?
                                <>
                                    <Typography component={'span'} variant={'body1'} textAlign={'center'}>
                                        {'برای شروع گفت و گو با استاد '}
                                        {teacher.user.fName + ' ' + teacher.user.lName}
                                        {' روی دکمه زیر کلیک کنید.'}
                                    </Typography>
                                    <Button variant={'contained'} onClick={handleStartChat}>
                                        شروع گفت و گو
                                    </Button>
                                </> :
                                <Messenger socket={socket} user={user} teacher={teacher} chatId={chat.id}/>
                        }
                    </Stack>
                </Box>
            </Box>
        </>
    );
}

export default ChatBox;