import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip, Snackbar,
    Typography
} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import GradingIcon from '@mui/icons-material/Grading';
import {Link} from "react-router-dom";
import IconBox from "../../Components/IconBox";
import React, {useContext, useEffect, useState} from "react";
import userContext from "../../Contexts/UserContext";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Api from "../../Api/Api";
import FavoriteIcon from '@mui/icons-material/Favorite';

function CourseCard({course, forTeacher = false}) {
    const user = useContext(userContext);
    const isCurrentTeacherCourse = user.current.appBarUser.teacher && course.userId === user.current.appBarUser.teacher.id;
    const [likes, setLikes] = useState(course.likes.length);
    const [liked, setLiked] = useState(course.likes.filter(lk => lk.userId === user.current.appBarUser.id).length > 0);

    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        message: '',
        type: 'error',
    });

    async function handleLike() {
        try {
            const response = await Api.post('/like/' + course.id);
            if (response.data.res === 200) {
                const res = await Api.get('/like/' + course.id);
                const liked = res.data.like.status === "LIKE";
                if (liked) {
                    setLiked(true);
                    setLikes(likes + 1)
                } else {
                    setLiked(false);
                    setLikes(likes - 1)
                }
            }
        } catch (e) {
            setSnackbarStatus({
                open: 'true',
                type: 'error',
                message: 'لطفا بعدا تلاش کنید.'
            });
        }

    }

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarStatus({...snackbarStatus, open: false});
    }

    return (
        <>
            <Card>
                <CardHeader title={course.title}/>

                <Box sx={{
                    padding: '0 16px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                }}>
                    <Chip
                        variant={'outlined'}
                        label={course.category.faName}></Chip>
                </Box>

                <CardContent>
                    <Box sx={{
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'column'
                    }}>
                        {
                            !forTeacher &&
                            <IconBox>
                                <SchoolIcon color={'unImportant'}/>
                                <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'}>
                                    {'مدرس: '}
                                    {course.teacher.user.fName + ' ' + course.teacher.user.lName}
                                </Typography>
                            </IconBox>
                        }
                        <IconBox>
                            <GradingIcon color={'unImportant'}/>
                            <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'}>
                                {'پیش نیاز: '}
                                {course.perquisites}
                            </Typography>
                        </IconBox>
                    </Box>
                    <Typography component={'p'} variant={'body1'} pt={1}>
                        {course.descriptions}
                    </Typography>

                </CardContent>
                <CardActions>
                    {
                        isCurrentTeacherCourse &&
                        <Link
                            to={'/teachers/courses/' + course.id}>
                            <Button size="small" variant={'outlined'}>مدیریت</Button>
                        </Link>
                    }
                    <Link
                        to={'/courses/' + course.id}>
                        <Button size="small"
                                variant={!isCurrentTeacherCourse ? 'outlined' : 'text'}>مشاهده</Button>
                    </Link>
                    <Box sx={{flexGrow: 10, display: 'flex', justifyContent: 'right'}}>
                        <Button endIcon={
                            liked ?
                                <FavoriteIcon fontSize={'small'} color={'error'}/> :
                                <FavoriteBorderIcon fontSize={'small'}/>
                        } onClick={handleLike}>
                            {likes}
                        </Button>

                    </Box>
                </CardActions>
                <Snackbar
                    open={snackbarStatus.open}
                    autoHideDuration={6000}
                    onClose={handleSnackBarClose}>
                    <Alert severity={snackbarStatus.type} sx={{width: '100%'}}>
                        {snackbarStatus.message}
                    </Alert>
                </Snackbar>
            </Card>
        </>
    );
}

export default CourseCard;