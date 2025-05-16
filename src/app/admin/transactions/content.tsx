'use client'

import User from '@/models/User'
import { Button, Popconfirm, Space, Table, TableProps, Tag } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import React, { useCallback, useEffect, useState } from 'react'
import { index } from '@/apis/custom_fetch'
import { TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import axios from '@/lib/axios'
import { URL_CONTROLLER, URL_CONTROLLER_ID } from '@/contains/api'
import useNoti from '@/hooks/useNoti'
import Role from '@/models/Role'
import { colors } from '@/contains/colorTag'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Transaction, { TransactionPaymentMethod, TransactionStatus } from '@/models/Transaction'
interface TableParams {
    pagination?: TablePaginationConfig;
}
export default function TransactionContent() {
    const { noti } = useNoti()
    const queryClient = useQueryClient()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });

    const { data: transactions } = index<Transaction>('transactions', {
        load: 'user',
    })

    const mutationDelete = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'transactions') + `/${id}`;
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
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    const columns: TableProps<Transaction>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Người dùng',
            dataIndex: 'user',
            key: 'user',
            render: (user: User) => {
                return <Link href={`/admin/users/edit/${user.id}`}>{user.name}</Link>
            }
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (payment_method: TransactionPaymentMethod) => {
                return <Tag color={colors[Math.floor(Math.random() * 10)]}>{payment_method}</Tag>
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: string, record: Transaction) => {
                let color = 'blue';
                switch (record.status) {
                    case TransactionStatus.COMPLETED:
                        color = 'green';
                        break;
                    case TransactionStatus.FAILED:
                        color = 'red';
                        break;
                    case TransactionStatus.PENDING:
                        color = 'gold';
                        break;
                }
                return <Tag color={color}>{record.status}</Tag>
            }
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            key: 'actions',
            render: (text: string, record: Transaction) => {
                return (
                    <Space size="middle">
                        <Button type='primary' icon={<EyeOutlined />} >
                            <Link href={`/admin/transactions/show/${record.id}`}>Xem</Link>
                        </Button>
                    </Space>
                )
            }
        },
    ]

    return (
        <Table columns={columns} dataSource={transactions?.data ?? []} pagination={tableParams.pagination} />
    )
}
