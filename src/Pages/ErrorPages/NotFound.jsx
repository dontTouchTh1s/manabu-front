import {useRouteError} from "react-router-dom";
import {Container, Stack, Typography} from "@mui/material";

function NotFound({error}) {


    return (
        <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
            <Stack spacing={1}>
                <Typography component={'h1'} variant={'h1'} align={'center'}>
                    {error.name}
                </Typography>
                <Typography component={'p'} variant={'h5'} align={'center'}>
                    {error.message}
                </Typography>
                <Typography component={'p'} variant={'h5'} align={'center'}>
                    {error.status}
                </Typography>
            </Stack>
        </Container>
    );
}

export default NotFound;