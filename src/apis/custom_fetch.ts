import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { URL_CONTROLLER, URL_CONTROLLER_ID } from '@/contains/api';
import { PAGE_SIZE } from '@/contains/index';
import { ApiRequestListFilter, ApiRequestDetailFilter, ApiResponseList, ApiResponseDetail } from '@/types/Api';
import { message } from 'antd';

export const index = <T>(controller: string, params?: ApiRequestListFilter, url?: string): UseQueryResult<ApiResponseList<T>> => {
    params = params || {};
    params.page = params.page || 1;
    params.limit = params.limit || PAGE_SIZE;
    if (params.load?.length) {
        params.load = Array.isArray(params.load) ? params.load.join(',') : params.load;
    }
    return useQuery({
        queryKey: [controller, { params }],
        queryFn: async () => {
            const baseUrl = url || URL_CONTROLLER.replace(':controller', controller);
            const { data } = await axios.get<ApiResponseList<T>>(baseUrl, { params });
            return data;
        },
    });
};

export const show = <T>(controller: string, id: number | string, params?: ApiRequestDetailFilter, url?: string): UseQueryResult<ApiResponseDetail<T>> => {
    if (params?.load?.length) {
        params.load = Array.isArray(params.load) ? params.load.join(',') : params.load;
    }
    return useQuery({
        queryKey: [controller, id, params],
        queryFn: async () => {
            const baseUrl = url || URL_CONTROLLER_ID.replace(':controller', controller).replace(':id', id.toString());
            const { data } = await axios.get<ApiResponseDetail<T>>(baseUrl, { params });
            return data;
        },
    });
};
export const showByUrl = <T>(url: string, params?: ApiRequestDetailFilter): UseQueryResult<ApiResponseDetail<T>> => {
    if (params?.load?.length) {
        params.load = Array.isArray(params.load) ? params.load.join(',') : params.load;
    }
    return useQuery({
        queryKey: [url],
        queryFn: async () => {
            const { data } = await axios.get<ApiResponseDetail<T>>(url, { params });
            return data;
        },
    });
};
