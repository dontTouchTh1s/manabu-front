import useSWRImmutable from "swr/immutable";
import ChatRoom from "../../Components/ChatRoom/ChatRoom";
import Api from "../../Api/Api";
import LoadingCircle from "../../Components/LoadingCircle";
import {useContext, useEffect, useState} from "react";
import userContext from "../../Contexts/UserContext";
import {Box, Container, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import io from "socket.io-client";

async function studentsFetcher(url) {
    return Api.get(url).then(response => response.data.users);
}

function TeacherChatRoom() {
    const {courseId} = useParams();
    const [socket, setSocket] = useState(null);
    const {
        data: students,
        isLoading: studentsIsLoading
    } = useSWRImmutable('/teacherCourses/' + courseId + '/1000/0', studentsFetcher, {revalidateOnMount: true});

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
                    از این قسمت میتوانید با دانشجو های دوره گفت و گو کنید.
                </Typography>
                {
                    !studentsIsLoading && socket ?
                        <ChatRoom socket={socket}
                                  contacts={students.map(std => std.user)}
                                  sender={user.current.appBarUser.teacher}
                                  forTeacher/>
                        : <LoadingCircle/>
                }
            </Container>
        </Box>
    );
}

export default TeacherChatRoom;