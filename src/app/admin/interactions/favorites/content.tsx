'use client'

import { index } from '@/apis/custom_fetch';
import { URL_CONTROLLER } from '@/contains/api';
import useNoti from '@/hooks/useNoti';
import Favorite from '@/models/Favorite';
import { Button, Popconfirm, Space, Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from '@/lib/axios';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AdvancedSearchForm, { FilterList } from '@/components/interactions/AdvancedSearchForm';
import User from '@/models/User';
import Document from '@/models/Document';
interface TableParams {
    pagination?: TablePaginationConfig;
}

export default function FavoritesContent() {
    const { noti } = useNoti();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useState<any>({});

    const { data: favorites, refetch } = index<Favorite>('favorites', {
        load: 'document,user',
        ...searchParams
    });
    const { data: users } = index<User>('users', {
        filter: {
            ids: searchParams.users
        }
    });
    const { data: documents } = index<Document>('documents', {
        filter: {
            ids: searchParams.documents
        }
    });

    const mutationDelete = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'favorites') + `/${id}`;
            const res = await axios.delete(url);
            return res.data;
        },
        onError: (error: any) => {
            noti({
                message: 'Thất bại',
                description: error?.response?.data?.message || 'Xóa thất bại',
                type: 'error',
            })
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Xóa yêu thích thành công',
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    })

    const columns: ColumnsType<Favorite> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Người dùng',
            dataIndex: ['user', 'name'],
            key: 'user',
        },
        {
            title: 'Tài liệu',
            dataIndex: ['document', 'title'],
            key: 'document',
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (record: Favorite) => (
                <Space>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => mutationDelete.mutate(record.id.toString())}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    const onFinish = (values: any) => {
        // const filter = {
        //     ...searchParams,
        // }
        console.log(values);
        setSearchParams(values);
        refetch();
    };

    const filterList: FilterList[] = [
        {
            label: 'Người dùng',
            key: 'users',
            type: 'select',
            options: users?.data?.map((item: User) => ({
                label: item.name,
                value: item.id.toString(),
            })),
            mode: 'multiple',
            required: false,
        },
        {
            label: 'Tài liệu',
            key: 'documents',
            type: 'select',
            options: documents?.data?.map((item: Document) => ({
                label: item.title,
                value: item.id.toString(),
            })),
            mode: 'multiple',
            required: false
        },
    ]

    return (
        <div>
            <AdvancedSearchForm onFinish={onFinish} filterList={filterList} />
            <Table columns={columns} dataSource={favorites?.data || []} rowKey="id" />
        </div>
    );
}