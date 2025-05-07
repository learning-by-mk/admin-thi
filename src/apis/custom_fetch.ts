import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { URL_CONTROLLER, URL_CONTROLLER_ID } from '@/contains/api';
import { PAGE_SIZE } from '@/contains/index';
import { ApiRequestListFilter, ApiRequestDetailFilter, ApiResponseList, ApiResponseDetail } from '@/types/Api';

export const customFetch = <T>(controller: string, params?: ApiRequestListFilter): UseQueryResult<ApiResponseList<T>> => {
    params = params || {};
    params.page = params.page || 1;
    params.limit = params.limit || PAGE_SIZE;
    if (params.include?.length) {
        params.include = Array.isArray(params.include) ? params.include.join(',') : params.include;
    }
    return useQuery({
        queryKey: [controller, { params }],
        queryFn: async () => {
            const { data } = await axios.get<ApiResponseList<T>>(URL_CONTROLLER.replace(':controller', controller), { params });
            return data;
        },
    });
};

export const customFetchDetail = <T>(controller: string, id: number | string, params?: ApiRequestDetailFilter): UseQueryResult<ApiResponseDetail<T>> => {
    if (params?.include?.length) {
        params.include = Array.isArray(params.include) ? params.include.join(',') : params.include;
    }
    return useQuery({
        queryKey: [controller, id, params],
        queryFn: async () => {
            const { data } = await axios.get<ApiResponseDetail<T>>(URL_CONTROLLER_ID.replace(':controller', controller).replace(':id', id.toString()), { params });
            return data;
        },
    });
};
