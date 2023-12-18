import {Box, IconButton, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import Message from "../ChatBox/Message";
import SendIcon from "@mui/icons-material/Send";
import {useEffect, useRef, useState} from "react";
import '../../Themes/custom-scrollbar.css';

function Messenger({socket, teacher, user, chatId, maxHeight = '400px', forTeacher = false}) {
    const [messagesList, setMessagesList] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const lastMessage = useRef();
    const info = {
        teacherId: teacher.id,
        userId: user.id,
        chatId: chatId,
    }
    !forTeacher && delete info.teacherId;

    async function sendMessage() {
        if (currentMessage !== '') {
            const messageData = {
                ...info,
                content: currentMessage
            };
            messageData.isMine = true;
            setMessagesList([...messagesList, messageData])
            await socket.emit('createMsg', JSON.stringify(messageData));
            setCurrentMessage('');
        }
    }

    useEffect(() => {
        socket.emit('messagesList', info);
    }, [socket, chatId]);


    useEffect(() => {
        socket.on('lastMessage', (data) => {
            setMessagesList([...messagesList, {content: data.lastMessage}]);
        });
    }, [socket, messagesList, chatId]);

    useEffect(() => {
        socket.on('messagesList', (data) => {
            setMessagesList(data.msgList.reverse());
        });
    }, [socket, chatId]);

    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messagesList]);

    function handleKey(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexGrow: 10,
                width: '100%',
                p: 1,
                maxHeight: maxHeight,
                overflowY: 'scroll',
                clear: 'both'
            }}
                 className={'custom-scrollbar small'}>
                {
                    messagesList.length !== 0 ?
                        <Stack spacing={2} sx={{flexGrow: 10}}>
                            {
                                messagesList.map(msg =>
                                    <Message key={messagesList.indexOf(msg)} message={msg}
                                             innerRef={lastMessage}/>
                                )
                            }
                        </Stack> :
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 10}}>
                            <Typography component={'span'} variant={'body1'} textAlign={'center'}>
                                {'هیچ پیامی ارسال نشده است.'}
                            </Typography>
                        </Box>
                }
            </Box>


            <TextField
                placeholder={'متن پیام'}
                fullWidth
                onKeyDown={handleKey}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                edge="start"
                                onClick={sendMessage}
                                disabled={currentMessage === '' || !user}
                            >
                                <SendIcon color={'primary'} sx={{transform: 'scaleX(-1)'}}/>
                            </IconButton>
                        </InputAdornment>
                }}
            />
        </>
    );
}

export default Messenger;