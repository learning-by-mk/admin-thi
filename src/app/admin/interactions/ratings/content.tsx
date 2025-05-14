'use client'

import { index } from '@/apis/custom_fetch';
import { URL_CONTROLLER } from '@/contains/api';
import useNoti from '@/hooks/useNoti';
import Rating from '@/models/Rating';
import { Button, Popconfirm, Rate, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from '@/lib/axios';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function RatingsContent() {
    const { noti } = useNoti();
    const queryClient = useQueryClient();

    const { data: ratings } = index<Rating>('ratings', {
        load: 'document,user'
    });

    const mutationDelete = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'ratings') + `/${id}`;
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
                description: 'Xóa đánh giá thành công',
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['ratings'] });
        },
    })

    const columns: ColumnsType<Rating> = [
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
            title: 'Đánh giá',
            dataIndex: 'score',
            key: 'score',
            render: (score: number) => <Rate disabled defaultValue={score} />,
        },
        {
            title: 'Nhận xét',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (record: Rating) => (
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

    return (
        <Table columns={columns} dataSource={ratings?.data || []} rowKey="id" />
    );
}