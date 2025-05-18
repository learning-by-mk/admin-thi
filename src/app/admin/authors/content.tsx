'use client'

import Author from '@/models/Author'
import { Button, Popconfirm, Space, Table, TableProps, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { index } from '@/apis/custom_fetch'
import { TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import axios from '@/lib/axios'
import { URL_CONTROLLER } from '@/contains/api'
import useNoti from '@/hooks/useNoti'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface TableParams {
    pagination?: TablePaginationConfig;
}

export default function AuthorContent() {
    const { noti } = useNoti()
    const queryClient = useQueryClient()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });

    const { data: authors } = index<Author>('authors', {
        load: 'user',
    })

    const mutationDelete = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'authors') + `/${id}`;
            const res = await axios.delete(url);
            return res.data;
        },
        onError: (error: any) => {
            console.log(error);
            noti({
                message: 'Thất bại',
                description: error?.response?.data?.message || 'Xóa thất bại',
                type: 'error',
            })
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Xóa thành công',
                type: 'success',
            })
            queryClient.invalidateQueries({ queryKey: ['authors'] })
        },
    })

    const columns: TableProps<Author>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên người dùng',
            dataIndex: ['user', 'name'],
            key: 'user_name',
        },
        {
            title: 'Chuyên ngành',
            dataIndex: 'specialization',
            key: 'specialization',
        },
        {
            title: 'Học vấn',
            dataIndex: 'education',
            key: 'education',
        },
        {
            title: 'Tổng tài liệu',
            dataIndex: 'total_documents',
            key: 'total_documents',
        },
        {
            title: 'Tổng lượt tải',
            dataIndex: 'total_downloads',
            key: 'total_downloads',
        },
        {
            title: 'Tổng lượt thích',
            dataIndex: 'total_likes',
            key: 'total_likes',
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            key: 'actions',
            render: (text: string, record: Author) => {
                return (
                    <Space size="middle">
                        <Button type='primary' icon={<EditOutlined />} >
                            <Link href={`/admin/authors/edit/${record.id}`}>Chỉnh sửa</Link>
                        </Button>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa không?"
                            onConfirm={() => mutationDelete.mutate(record.id.toString())}
                        >
                            <Button type='default' danger icon={<DeleteOutlined />}>Xóa</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        },
    ]

    return (
        <Table columns={columns} dataSource={authors?.data ?? []} pagination={tableParams.pagination} />
    )
} 