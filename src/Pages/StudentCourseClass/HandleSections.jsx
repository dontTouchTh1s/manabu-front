import Grid from "@mui/material/Unstable_Grid2";
import NotDataBox from "../../Components/NotDataBox";
import {Typography} from "@mui/material";
import SectionSkeleton from "../ManageSections/SectionSkeleton";
import useCourseSections from "../../Hooks/useCourseSections";
import StudentSectionCard from "./StudentSectionCard";

function HandleSections({courseId}) {
    const {sections, sectionsIsLoading} = useCourseSections(courseId);

    return (
        <>
            {
                !sectionsIsLoading ?
                    sections.length !== 0 ?
                        sections.map(sec =>
                            <Grid key={sec.id} xs={12} sm={6} md={4}>
                                <StudentSectionCard section={sec}/>
                            </Grid>) :
                        <Grid xs={12}>
                            <NotDataBox height={'170x'}>
                                <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                                    {'موردی یافت نشد!'}
                                </Typography>
                            </NotDataBox>
                        </Grid>
                    : <>
                        <Grid>
                            <SectionSkeleton/>
                        </Grid>
                        <Grid>
                            <SectionSkeleton/>
                        </Grid>
                    </>
            }
        </>
    );
}

export default HandleSections;