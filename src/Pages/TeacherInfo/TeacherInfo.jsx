import Api from "../../Api/Api";
import {Avatar, Box, Button, Container, Divider, Stack, Typography} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import SchoolIcon from "@mui/icons-material/School";
import moment from "moment-jalaali";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import DateRangeIcon from '@mui/icons-material/DateRange';
import IconBox from "../../Components/IconBox";
import useSWRImmutable from "swr/immutable";
import LoadingCircle from "../../Components/LoadingCircle";
import toPersianNumber from "../../Functions/ToPersianNumber";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.teacher);
}

function TeacherInfo() {
    const {teacherId} = useParams();
    const {
        data: teacher,
        isLoading: teacherIsLoading,
    } = useSWRImmutable('/teacher/' + teacherId, fetcher, {revalidateOnMount: true});

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                مشخصات استاد
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                {
                    !teacherIsLoading && teacher ?
                        <Grid container spacing={{xs: 2, md: 3}}>

                            <Grid xs={12} sm={6} md={4}>
                                <Box sx={{
                                    display: 'flex',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    backgroundColor: 'background.paper',
                                    p: 2
                                }}>
                                    <Stack spacing={2} width={'100%'}>
                                        <IconBox>
                                            <SchoolIcon fontSize={'large'}/>
                                            <Typography component="h2" variant="h5" sx={{textAlign: 'left'}}>
                                                {'درباره مدرس'}
                                            </Typography>
                                        </IconBox>
                                        <Avatar sx={{
                                            alignSelf: 'center',
                                            width: {xs: 70, sm: 100, md: 200},
                                            height: {xs: 70, sm: 100, md: 200},
                                        }}>
                                        </Avatar>
                                        <Typography component="span" variant="h6" sx={{textAlign: 'center'}}>
                                            {teacher.user.fName + ' ' + teacher.user.lName}
                                            <Typography component="span" variant="subtitle2"
                                                        sx={{textAlign: 'left'}}>
                                                {' (' + teacher.user.alias + ') '}
                                            </Typography>
                                        </Typography>
                                        <Divider/>
                                        <Box>
                                            <IconBox>
                                                <PhoneEnabledIcon fontSize={'small'}/>
                                                <Typography component="p" variant="subtitle1" sx={{textAlign: 'left'}}>
                                                    {'شماره تماس'}
                                                </Typography>
                                            </IconBox>
                                            <Typography component="p" variant="body1" sx={{textAlign: 'right'}}>
                                                {toPersianNumber(teacher.phone)}
                                            </Typography>
                                        </Box>
                                        <Divider/>
                                        <Box>
                                            <IconBox>
                                                <DateRangeIcon fontSize={'small'}/>
                                                <Typography component="span" variant="subtitle1"
                                                            sx={{textAlign: 'left'}}>
                                                    {'تاریخ عضویت'}
                                                </Typography>
                                            </IconBox>
                                            <Typography component="p" variant="body1" sx={{textAlign: 'right'}}>
                                                {toPersianNumber(moment(teacher.createdAt).format('jYYYY/jMM/jDD'))}
                                            </Typography>
                                        </Box>


                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid xs={12} sm={6} md={8} container>
                                <Grid xs={12} sx={{height: '85%'}}>
                                    <Typography component="p" variant="h6" sx={{textAlign: 'left'}}>
                                        {'روزمه'}
                                    </Typography>
                                    <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                        {teacher.resume}
                                    </Typography>
                                </Grid>
                                <Grid xs={12}>
                                    <Link to={'./courses'}>
                                        <Button variant={'text'}>
                                            دوره های برگزار شده توسط مدرس
                                        </Button>
                                    </Link>
                                </Grid>

                            </Grid>
                        </Grid> : <LoadingCircle/>
                }
            </Container>
        </Box>
    )
}

export default TeacherInfo;