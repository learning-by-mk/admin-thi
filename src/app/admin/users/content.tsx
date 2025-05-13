'use client'

import User from '@/models/User'
import { Button, Popconfirm, Space, Table, TableProps, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useCallback, useEffect, useState } from 'react'
import { index } from '@/apis/custom_fetch'
import { TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import axios from '@/lib/axios'
import { URL_CONTROLLER, URL_CONTROLLER_ID } from '@/contains/api'
import useNoti from '@/hooks/useNoti'
import Role from '@/models/Role'
import { colors } from '@/contains/colorTag'
import { useMutation } from '@tanstack/react-query'
interface TableParams {
    pagination?: TablePaginationConfig;
}
export default function UserContent() {
    const { noti } = useNoti()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });

    const mutationDelete = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'users') + `/${id}`;
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
        },
    })

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
            render: (text: string, record: User) => {
                return <Tag color={record.status === 'active' ? 'green' : 'red'}>{record.status}</Tag>
            }
        },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: Role[]) => {
                return roles.map((role: Role, index: number) => <Tag color={colors[Math.floor(Math.random() * 10)]} key={role.id}>{role.name}</Tag>)
            }
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

    const { data: users } = index<User>('users', {
        load: 'roles',
    })

    return (
        <Table columns={columns} dataSource={users?.data ?? []} pagination={tableParams.pagination} />
    )
}
