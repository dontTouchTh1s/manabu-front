import useSWRImmutable from "swr/immutable";
import ChatRoom from "../../Components/ChatRoom/ChatRoom";
import Api from "../../Api/Api";
import LoadingCircle from "../../Components/LoadingCircle";
import {useContext, useEffect, useState} from "react";
import userContext from "../../Contexts/UserContext";
import {Box, Container, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import io from "socket.io-client";

function ChatRoomAllContact() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io.connect('http://localhost:8080/api/chat'));
    }, []);

    const user = useContext(userContext);
    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                گفت و گو
            </Typography>

            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                    از این قسمت میتوانید با مخاطبین خود گفت و گو کنید.
                </Typography>
                {
                    <ChatRoom socket={socket}
                              sender={user.current.appBarUser}
                              forTeacher={user.current.appBarUser.teacher}/>
                }
            </Container>
        </Box>
    );
}

export default ChatRoomAllContact;