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
import { index } from '@/apis/custom_fetch';
import Document from '@/models/Document';
import Category from '@/models/Category';
import { colors } from '@/contains/colorTag';
import { TablePaginationConfig } from 'antd/es/table';

interface TableParams {
    pagination?: TablePaginationConfig;
}

const DocumentsContent = () => {
    const router = useRouter();
    const { noti } = useNoti();
    const queryClient = useQueryClient();

    const { data: documents } = index<Document>('documents', {
        load: "categories, author, uploadedBy"
    })

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'documents') + `/${id}`;
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
                description: 'Xóa tài liệu thành công',
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Danh mục',
            dataIndex: 'categories',
            key: 'category',
            render: (categories: Category[]) => {
                return categories.map((category) => <Tag color={colors[Math.floor(Math.random() * 10)]} key={category.id}>{category.name}</Tag>);
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'blue';
                if (status === 'approved') {
                    color = 'green';
                } else if (status === 'rejected') {
                    color = 'red';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Người tải lên',
            dataIndex: ['uploaded_by', 'name'],
            key: 'uploaded_by',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: Document) => (
                <Space size="middle">
                    <Link href={`/admin/documents/edit/${record.id}`}>
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
            dataSource={documents?.data || []}
            rowKey="id"
            pagination={tableParams.pagination}

        />
    );
};

export default DocumentsContent;