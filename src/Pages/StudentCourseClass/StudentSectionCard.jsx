import {Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import GradingIcon from '@mui/icons-material/Grading';
import {Link} from "react-router-dom";
import IconBox from "../../Components/IconBox";

function StudentSectionCard({section, student = false}) {
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
                <Link
                    to={'/student/courses/' + section.courseId + '/sections/' + section.id}>
                    <Button size="small" variant={"outlined"}>مشاهده</Button>
                </Link>
            </CardActions>

        </Card>
    );
}

export default StudentSectionCard;