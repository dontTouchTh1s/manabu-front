import {Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import GradingIcon from '@mui/icons-material/Grading';
import {Link} from "react-router-dom";
import IconBox from "../../Components/IconBox";

function SectionCard({section, forStudent = false}) {
    return (
        <Card>
            <CardHeader title={section.title}>
            </CardHeader>

            <CardContent>
                <Typography component={'p'} variant={'body1'} pt={1}>
                    {section.descriptions}
                </Typography>

            </CardContent>
            <CardActions>
                {
                    forStudent ?
                        <Link
                            to={'/student/courses/' + section.courseId + '/sections/' + section.id}>
                            <Button size="small" variant={'outlined'}>مشاهده</Button>
                        </Link>
                        :
                        <>
                            <Link
                                to={'/teachers/courses/' + section.courseId + '/sections/' + section.id}>
                                <Button size="small">ویرایش</Button>
                            </Link>
                            <Link
                                to={'/teachers/courses/' + section.courseId + '/sections/' + section.id + '/homeworks'}>
                                <Button size="small">تکالیف</Button>
                            </Link>
                        </>
                }
            </CardActions>

        </Card>
    );
}

export default SectionCard;