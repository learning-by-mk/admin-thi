'use client'

import User from '@/models/User'
import { Button, Space, Table, TableProps } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { index } from '@/apis/custom_fetch'

export default function UserContent() {
    const columns: TableProps<User>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text: string, record: User) => {
                return (
                    <Space size="middle">
                        <Button type='primary' icon={<EditOutlined />} >Edit</Button>
                        <Button type='default' danger icon={<DeleteOutlined />}>Delete</Button>
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
        // Basic Table 
        <Table columns={columns} dataSource={users?.data ?? []} />
    )
}
