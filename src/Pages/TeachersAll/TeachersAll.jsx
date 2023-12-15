import {useLoaderData} from "react-router-dom";
import Api from "../../Api/Api";
import {Box, Container, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import TeacherCard from "./TeacherCard";
import {useState} from "react";
import useSWRImmutable from "swr/immutable";
import SectionSkeleton from "../ManageSections/SectionSkeleton";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.teacher);
}

function TeacherAll() {
    let {
        data: allTeachers,
        isLoading: allTeachersLoading
    } = useSWRImmutable('/teachers/100/0', fetcher, {revalidateOnMount: true});

    const [search, setSearch] = useState('');

    function handleSearch(value) {
        setSearch(value);
        const regex = new RegExp(value, 'i');
        allTeachers = allTeachers.filter(teacher => regex.test(teacher.user.fName + ' ' + teacher.user.lName));
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                مدرس ها
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} container justifyContent={'center'}>
                        <Grid xs={10} sm={7} md={6}>
                            <TextField
                                fullWidth
                                value={search}
                                label={'جست و جو'}
                                onChange={(e) => handleSearch(e.target.value)}>
                            </TextField>
                        </Grid>
                    </Grid>
                    {
                        !allTeachersLoading ?
                            allTeachers.length !== 0 ?
                                allTeachers.map(teacher =>
                                    <Grid key={teacher.id} xs={12} sm={6} md={4}>
                                        <TeacherCard teacher={teacher}>
                                        </TeacherCard>
                                    </Grid>
                                ) :
                                <Grid xs={12} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '400px'
                                }}>
                                    <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                                        {'موردی یافت نشد!'}
                                    </Typography>
                                </Grid> : <SectionSkeleton/>
                    }

                </Grid>
            </Container>
        </Box>);
}

export default TeacherAll;