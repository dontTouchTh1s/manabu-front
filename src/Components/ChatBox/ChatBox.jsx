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
    outline: 0,
    zIndex: 10001
};

const style = {
    p: {xs: 1, sm: 2}
}

function ChatBox({teacher, user, isOpen, forTeacher = false, onChange}) {
    const [open, setOpen] = useState(isOpen);
    const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState(null);

    useEffect(() => {
        setOpen(isOpen)
        setSocket(null)
    }, [isOpen]);

    function handleStartChat() {
        setSocket(io.connect('http://localhost:8080/api/chat'));
    }

    async function chatList(data) {
        await socket.emit('chatsList', data);
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
            <Box
                sx={containerStyle}
            >
                <Box sx={style} display={open ? 'block' : 'none'}>
                    <Stack spacing={1}>
                        <Box>
                            <IconButton onClick={() => {
                                setOpen(false)
                                onChange(false);
                            }}>
                                <CloseIcon/>
                            </IconButton>
                            <Typography component={'span'} variant={'body1'} textAlign={'left'}>
                                {
                                    !forTeacher ?
                                        <>
                                            {'استاد '}
                                            {
                                                teacher.user.fName + ' ' + teacher.user.lName
                                            }
                                        </> :
                                        user.fName + ' ' + user.lName
                                }
                            </Typography>
                        </Box>
                        {
                            !socket || !chat ?
                                <>
                                    <Typography component={'span'} variant={'body1'} textAlign={'center'}>
                                        {'برای شروع گفت و گو با '}
                                        {teacher.user.fName + ' ' + teacher.user.lName}
                                        {' روی دکمه زیر کلیک کنید.'}
                                    </Typography>
                                    <Button variant={'contained'} onClick={handleStartChat}>
                                        شروع گفت و گو
                                    </Button>
                                </> :
                                <Messenger socket={socket} user={user} teacher={teacher} chatId={chat.id}
                                           forTeacher={forTeacher}/>
                        }
                    </Stack>
                </Box>
            </Box>
        </>
    );
}

export default ChatBox;