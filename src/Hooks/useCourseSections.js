import Api from "../Api/Api";
import useSWRImmutable from "swr/immutable";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.sections);
}

function useCourseSections(courseId) {

    const {
        data: sections,
        isLoading: sectionsIsLoading
    } = useSWRImmutable('section/' + courseId + '/true', fetcher, {revalidateOnMount: true});
    return {
        sections, sectionsIsLoading
    };
}

export default useCourseSections;