'use client'

import User from '@/models/User'
import { Button, Space, Table, TableProps } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { index } from '@/apis/custom_fetch'
import { TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
interface TableParams {
    pagination?: TablePaginationConfig;
}
export default function UserContent() {
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });
    const columns: TableProps<User>['columns'] = [
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            key: 'actions',
            render: (text: string, record: User) => {
                return (
                    <Space size="middle">
                        <Button type='primary' icon={<EditOutlined />} >
                            <Link href={`/admin/users/edit/${record.id}`}>Chỉnh sửa</Link>
                        </Button>
                        <Button type='default' danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Space>
                )
            }
        },
    ]

    const { data: users } = index<User>('users', {
        include: 'roles',
    })

    useEffect(() => {
        if (users?.data) {
            console.log(users.data)
        }
    }, [users])
    return (
        <Table columns={columns} dataSource={users?.data ?? []} pagination={tableParams.pagination} />
    )
}
