'use client'

import Publisher from '@/models/Publisher'
import { Button, Popconfirm, Space, Table, TableProps } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { index } from '@/apis/custom_fetch'
import { TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import axios from '@/lib/axios'
import { URL_CONTROLLER } from '@/contains/api'
import useNoti from '@/hooks/useNoti'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'

interface TableParams {
    pagination?: TablePaginationConfig;
}

export default function PublisherContent() {
    const { noti } = useNoti()
    const queryClient = useQueryClient()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });

    const { data: publishers } = index<Publisher>('publishers')

    const mutationDelete = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'publishers') + `/${id}`;
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
            queryClient.invalidateQueries({ queryKey: ['publishers'] })
        },
    })

    const columns: TableProps<Publisher>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Logo',
            dataIndex: 'logo_path',
            key: 'logo_path',
            render: (text: string) => {
                return text ? <Image src={text} alt="Logo" width={50} height={50} /> : 'Không có logo'
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            render: (text: string) => {
                return text ? <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> : 'Không có website'
            }
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            key: 'actions',
            render: (text: string, record: Publisher) => {
                return (
                    <Space size="middle">
                        <Button type='primary' icon={<EditOutlined />} >
                            <Link href={`/admin/publishers/edit/${record.id}`}>Chỉnh sửa</Link>
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
        <Table columns={columns} dataSource={publishers?.data ?? []} pagination={tableParams.pagination} />
    )
} 