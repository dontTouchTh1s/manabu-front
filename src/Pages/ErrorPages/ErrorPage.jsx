import {useRouteError} from "react-router-dom";
import {Container, Stack, Typography} from "@mui/material";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <Container>
            <Stack>
                <Typography component={'h1'} variant={'h1'} align={'center'}>
                    {error.name}
                </Typography>
                <Typography component={'p'} variant={'h5'} align={'center'}>
                    {error.message}
                </Typography>
                <p>
                    <i>{error.statusText || error.message}</i>
                </p>
            </Stack>
        </Container>
    );
}