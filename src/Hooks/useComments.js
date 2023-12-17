import Api from "../Api/Api";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import {useEffect, useState} from "react";

async function fetcher([url, params]) {
    return Api.post(url, params).then(response => response.data.comments);
}

function useComments(params) {

    const {
        data,
        isLoading,
        mutate
    } = useSWRImmutable(['/comments', params], (url, params) => fetcher(url, params), {revalidateOnMount: true});

    return {
        comments: data, commentsIsLoading: isLoading, commentMutate: mutate,
    }


}

export default useComments;