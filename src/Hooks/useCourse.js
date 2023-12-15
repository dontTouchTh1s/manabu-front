import Api from "../Api/Api";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.course);
}

function useCourse(courseId) {
    const {
        data,
        isLoading
    } = useSWRImmutable('/course/' + courseId, fetcher, {revalidateOnMount: true});

    return {
        course: data, courseIsLoading: isLoading
    }
}

export default useCourse;