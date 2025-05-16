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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Menu from '@/models/Menu'
interface TableParams {
    pagination?: TablePaginationConfig;
}
export default function MenuContent() {
    const { noti } = useNoti()
    const queryClient = useQueryClient()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });
    const { data: menus } = index<Menu>('menus', { load: 'parent', })

    const mutationDelete = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'menus') + `/${id}`;
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
            queryClient.invalidateQueries({ queryKey: ['menus'] })
        },
    })

    const columns: TableProps<Menu>['columns'] = [
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
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Href',
            dataIndex: 'href',
            key: 'href',
        },
        {
            title: 'Parent',
            dataIndex: ['parent', 'name'],
            key: 'parent'
        },
        {
            title: 'Thứ tự',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (text: boolean) => text ? <Tag color={'green'}>Hoạt động</Tag> : <Tag color={'red'}>Không hoạt động</Tag>
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            key: 'actions',
            render: (text: string, record: Menu) => {
                return (
                    <Space size="middle">
                        <Button type='primary' icon={<EditOutlined />} >
                            <Link href={`/admin/menus/edit/${record.id}`}>Chỉnh sửa</Link>
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
        <Table
            columns={columns}
            dataSource={menus?.data ?? []}
            pagination={tableParams.pagination}
            rowKey={(record) => record.id}
            expandable={{ expandedRowRender: undefined, expandIcon: () => null }}
        />
    )
}
