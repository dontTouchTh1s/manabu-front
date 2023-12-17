import Api from "../Api/Api";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.homeWork);
}

function useExam(courseId, sectionId) {
    const {
        data,
        isLoading,
        mutate
    } = useSWRImmutable('homework/' + courseId + '/' + sectionId, fetcher, {revalidateOnMount: true});

    return {
        homeWorks: data, homeWorksIsLoading: isLoading, homeWorksMutate: mutate
    }
}

export default useExam;