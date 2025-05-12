'use client'

import User from '@/models/User'
import { Button, Popconfirm, Space, Table, TableProps, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useCallback, useEffect, useState } from 'react'
import { index } from '@/apis/custom_fetch'
import { TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import axios from '@/lib/axios'
import { URL_CONTROLLER_ID } from '@/contains/api'
import useNoti from '@/hooks/useNoti'
import Role from '@/models/Role'
import { colors } from '@/contains/colorTag'
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
                            onConfirm={() => handleDelete(record.id)}
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

    const handleDelete = useCallback((id: number) => {
        axios.delete(URL_CONTROLLER_ID.replace(':controller', 'users').replace(':id', id.toString()))
            .then((res) => {
                if (res.status === 200) {
                    noti({
                        message: 'Thành công',
                        type: 'success',
                        description: 'Xóa thành công',
                    })
                } else {
                    noti({
                        message: 'Thất bại',
                        type: 'error',
                        description: 'Xóa thất bại'
                    })
                }
            })
    }, [])

    return (
        <Table columns={columns} dataSource={users?.data ?? []} pagination={tableParams.pagination} />
    )
}
