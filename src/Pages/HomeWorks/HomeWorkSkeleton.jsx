import {Box, Skeleton, Stack} from "@mui/material";

function HomeWorkSkeleton() {
    return (
        <Stack p={1} pt={3}>
            <Box p={1}>
                <Skeleton variant="h6"/>
            </Box>
            <Stack direction={'row'} spacing={1} p={1}>
                <Skeleton variant="rounded" width={77} height={32}
                          sx={{borderRadius: '20px'}}/>
                <Skeleton variant="rounded" width={60} height={32}
                          sx={{borderRadius: '20px'}}/>
                <Skeleton variant="rounded" width={54} height={32}
                          sx={{borderRadius: '20px'}}/>
            </Stack>
            <Box p={1}>
                <Skeleton variant="rounded" width={220} height={60}/>
            </Box>
            <Stack p={1} spacing={1}>
                <Skeleton height={10}/>
                <Skeleton height={10}/>
                <Skeleton height={10} width={'80%'}/>
            </Stack>
        </Stack>
    );
}

export default HomeWorkSkeleton;