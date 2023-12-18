import Grid from "@mui/material/Unstable_Grid2";
import {Avatar, Box, Button, Stack, Typography, useMediaQuery} from "@mui/material";
import RTLTheme from "../../Themes/RTLTheme";
import {useEffect, useState} from "react";
import Messenger from "../Chat/Messenger";
import io from "socket.io-client";

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: {xs: 40,},
            height: {xs: 40,}
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

function ChatRoom({socket, sender, contacts, forTeacher = false}) {
    const [currentReceiver, setCurrentReceiver] = useState(null);
    const [allReceivers, setAllReceivers] = useState(contacts);

    async function chatList(data) {
        await socket.emit('chatsList', data);
    }

    useEffect(() => {
        if (socket) {
            let data;
            if (forTeacher) {
                data = {teacherId: sender.id};
            } else {
                data = {userId: sender.id};
            }
            chatList(data);
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on('chatsList', (data) => {
                let newReceivers;
                if (forTeacher) {
                    newReceivers = data.map(cht => ({
                            ...cht.user,
                            chatId: cht.id
                        })
                    )
                } else {
                    newReceivers = data.map(cht => ({
                            ...cht.teacher.user,
                            chatId: cht.id
                        })
                    );
                }
                if (contacts) {
                    const allReceivers = [...newReceivers, ...contacts.filter(cnt => newReceivers.filter(rc => rc.id === cnt.id).length === 0)]
                    setAllReceivers(allReceivers);
                } else {
                    setAllReceivers(newReceivers);
                }

            })
        }
    }, [socket, sender, contacts]);


    const isXS = useMediaQuery(RTLTheme.breakpoints.down('sm'));
    return (
        <Grid container spacing={{xs: 2, md: 3}} sx={{minHeight: 400}}>
            <Grid xs={9} sm={8} sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {
                    currentReceiver ?
                        <>
                            <Box sx={{
                                width: '100%',
                                boxShadow: '0px 5px 6px -4px',
                                p: 2
                            }}>
                                <Typography component={'span'} variant={'subtitle1'} textAlign={'left'}>
                                    {currentReceiver.fName + ' ' + currentReceiver.lName}
                                </Typography>

                            </Box>
                            {
                                forTeacher ?
                                    <Messenger socket={socket} teacher={sender} user={currentReceiver}
                                               chatId={currentReceiver.chatId} forTeacher={forTeacher}/> :
                                    <Messenger socket={socket} user={sender} teacher={currentReceiver}
                                               chatId={currentReceiver.chatId} forTeacher={forTeacher}/>
                            }
                        </> :
                        <Typography component={'span'} variant={'subtitle1'}>
                            {'برای شروع گفت و گو یک مخاطب انتخاب کنید'}
                        </Typography>
                }
            </Grid>
            <Grid xs={3} sm={4}>
                <Box sx={{
                    border: '1px solid gray',
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'

                }}>
                    {

                        allReceivers && allReceivers.length !== 0 ?
                            <Stack sx={{height: '100%', width: '100%'}}>
                                {
                                    allReceivers.map(rc =>
                                        <Button
                                            key={rc.id}
                                            onClick={() => setCurrentReceiver(rc)}
                                            sx={{
                                                cursor: 'pointer'
                                            }}>
                                            <Avatar
                                                {...stringAvatar(rc.fName + ' ' + rc.lName)} ></Avatar>
                                            {
                                                !isXS ?
                                                    <Box sx={{
                                                        flexGrow: 10,
                                                        textAlign: 'left',
                                                        px: 1
                                                    }}>
                                                        <Typography component={'span'} variant={'subtitle1'}>
                                                            {rc.fName + ' ' + rc.lName}
                                                        </Typography>
                                                    </Box> : ''
                                            }
                                        </Button>)
                                }
                            </Stack>
                            :
                            <Typography component={'span'} variant={'body1'} textAlign={'center'}>
                                {'مخاطبی وجود ندارد'}
                            </Typography>

                    }
                </Box>
            </Grid>


        </Grid>
    );
}

export default ChatRoom;