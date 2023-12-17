import useExam from "../../Hooks/useExam";
import ShowExam from "./ShowExam";
import CreateExam from "./CreateExam";
import LoadingCircle from "../../Components/LoadingCircle";
import {useCallback, useState} from "react";

function HandleExam({courseId}) {
    const {exam, examIsLoading, examMutate} = useExam(courseId);

    return (
        <>
            {
                !examIsLoading ?
                    exam ?
                        // exam already created
                        <ShowExam exam={exam}/>
                        :
                        <CreateExam courseId={courseId} onExamCreate={async () => {
                            examMutate()
                        }}/>
                    :
                    <LoadingCircle/>
            }
        </>
    );
}

export default HandleExam;