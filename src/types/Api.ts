export interface ApiRequestListFilter {
    filter?: any;
    sort?: any;
    load?: string[] | string;
    page?: number;
    limit?: number;
}

export interface ApiRequestDetailFilter {
    load?: string[] | string;
}

export interface ApiResponsePagination {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface ApiResponseList<T> {
    data: T[];
    meta: ApiResponsePagination;
}

export interface ApiResponseDetail<T> {
    data: T;
}
