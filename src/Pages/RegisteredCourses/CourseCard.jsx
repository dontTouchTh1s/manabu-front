import {Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import GradingIcon from '@mui/icons-material/Grading';
import {Link} from "react-router-dom";
import IconBox from "../../Components/IconBox";

function CourseCard({takenCourse}) {
    return (
        <>
            <Card>
                <CardHeader title={takenCourse.course.title}>
                </CardHeader>

                <Box sx={{
                    padding: '0 16px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                }}>
                    <Chip
                        variant={'outlined'}
                        label={takenCourse.course.category.faName}></Chip>
                </Box>

                <CardContent>
                    <Box sx={{
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'column'
                    }}>
                        <IconBox>
                            <SchoolIcon color={'unImportant'}/>
                            <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'}>
                                {'مدرس: '}
                                {takenCourse.teacher.user.fName + ' ' + takenCourse.teacher.user.lName}
                            </Typography>
                        </IconBox>
                        <IconBox>
                            <GradingIcon color={'unImportant'}/>
                            <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'}>
                                {'پیش نیاز: '}
                                {takenCourse.course.perquisites}
                            </Typography>
                        </IconBox>
                    </Box>
                    <Typography component={'p'} variant={'body1'} pt={1}>
                        {takenCourse.course.descriptions}
                    </Typography>

                </CardContent>
                <CardActions>
                    <Link
                        to={'/courses/' + takenCourse.course.id}>
                        <Button size="small">مشاهده</Button>
                    </Link>
                    <Link
                        to={'/student/courses/' + takenCourse.course.id}>
                        <Button size="small" variant={'outlined'}>کلاس دوره</Button>
                    </Link>
                </CardActions>

            </Card>
        </>
    );
}

export default CourseCard;