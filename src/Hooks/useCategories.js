import Api from "../Api/Api";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.categories);
}

function useCategories() {
    const {data, error, isLoading} =
        useSWRImmutable('/categories', fetcher, {revalidateOnMount: true});

    return {
        categories: data,
        categoriesError: error,
        categoriesIsLoading: isLoading
    }
}

export default useCategories;