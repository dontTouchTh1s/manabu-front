import Api from "../Api/Api";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.exam);
}

function useDownload(courseId) {
    const {
        data,
        isLoading,
        mutate
    } = useSWRImmutable('/exams/' + courseId, fetcher, {revalidateOnMount: true});

    return {
        exam: data, examIsLoading: isLoading, examMutate: mutate
    }
}

export default useDownload;