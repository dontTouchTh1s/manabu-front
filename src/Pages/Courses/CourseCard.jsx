import {Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import GradingIcon from '@mui/icons-material/Grading';
import {Link} from "react-router-dom";
import IconBox from "../../Components/IconBox";

function CourseCard({course}) {
    const level = course.level === 'A1' ? 'Elementary' :
        course.level === 'A2' ? 'Pre-Intermediate' :
            course.level === 'B1' ? 'Intermediate' :
                course.level === 'B2' ? 'Upper-Intermediate' :
                    course.level === 'C1' ? 'Advanced' :
                        course.level === 'C2' ? 'Proficiency' : ''
    return (
        <>
            <Card>
                <CardHeader title={course.title}>
                </CardHeader>

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
                        <IconBox>
                            <SchoolIcon color={'unImportant'}/>
                            <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'}>
                                {'مدرس: '}
                                {course.teacher.user.fName + ' ' + course.teacher.user.lName}
                            </Typography>
                        </IconBox>
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
                    <Link
                        to={'/courses/' + course.id}>
                        <Button size="small">مشاهده</Button>
                    </Link>
                </CardActions>

            </Card>
        </>
    );
}

export default CourseCard;