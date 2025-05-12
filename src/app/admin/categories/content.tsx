'use client'

import { URL_CONTROLLER } from '@/contains/api';
import axios from '@/lib/axios';
import { Popconfirm, Table, Button, Space, Tag } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import useNoti from '@/hooks/useNoti';
import Category from '@/models/Category';
import { index } from '@/apis/custom_fetch';
import { TablePaginationConfig } from 'antd/es/table';

interface TableParams {
    pagination?: TablePaginationConfig;
}

const CategoriesContent = () => {
    const { noti } = useNoti();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });

    const { data: categories } = index<Category>('categories')

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const url = `${URL_CONTROLLER}/categories/${id}`;
            const res = await axios.delete(url);
            return res.data;
        },
        onError: (error) => {
            console.log(error);
            setError(error.message);
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Xóa danh mục thành công',
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text?.length > 100 ? `${text.substring(0, 100)}...` : text,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color = status === 'active' ? 'green' : 'red';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: Category) => (
                <Space size="middle">
                    <Link href={`/admin/categories/edit/${record.id}`}>
                        <Button type="primary" size="small">
                            Sửa
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => mutation.mutate(record.id.toString())}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={categories?.data || []}
            rowKey="id"
            pagination={tableParams.pagination}
        />
    );
};

export default CategoriesContent; 