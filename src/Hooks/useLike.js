import Api from "../Api/Api";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import {useEffect, useState} from "react";

async function fetcher(url) {
    return Api.get(url).then(response => response.data.like);
}

function useLike(courseId) {

    const {
        data,
        isLoading,
        mutate
    } = useSWRImmutable('/like/' + courseId, fetcher, {revalidateOnMount: true});

    return {
        like: data, likeIsLoading: isLoading, likeMutate: mutate,
    }


}

export default useLike;