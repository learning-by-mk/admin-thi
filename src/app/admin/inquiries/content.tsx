'use client'

import { URL_CONTROLLER } from '@/contains/api';
import axios from '@/lib/axios';
import { Popconfirm, Table, Button, Space, Tag } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNoti from '@/hooks/useNoti';
import Category from '@/models/Category';
import { index } from '@/apis/custom_fetch';
import { TablePaginationConfig } from 'antd/es/table';
import iconComponents from '@/contains/icon';
import Inquiry, { InquiryStatus, InquiryTopic } from '@/models/Inquiry';
import User from '@/models/User';

const renderIcon = (iconName: string, props = {}) => {
    if (iconName in iconComponents) {
        const IconComponent = iconComponents[iconName];
        return <IconComponent {...props} />;
    }
    return null;
};

interface TableParams {
    pagination?: TablePaginationConfig;
}

const InquiriesContent = () => {
    const { noti } = useNoti();
    const queryClient = useQueryClient();
    // const [error, setError] = useState<string | null>(null);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });

    const { data: inquiries } = index<Inquiry>('inquiries', {
        load: 'user'
    })

    const mutationDelete = useMutation({
        mutationFn: async (id: string) => {
            const url = URL_CONTROLLER.replace(':controller', 'inquiries') + `/${id}`;
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
                description: 'Xóa câu hỏi thành công',
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['inquiries'] });
        },
    })

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Người dùng',
            dataIndex: 'user',
            key: 'user',
            render: (user: User) => user?.name,
        },
        {
            title: 'Chủ đề',
            dataIndex: 'topic',
            key: 'topic',
            render: (topic: InquiryTopic) => <Tag color={topic === InquiryTopic.GENERAL ? 'blue' : topic === InquiryTopic.TECHNICAL ? 'green' : topic === InquiryTopic.CONTENT ? 'purple' : topic === InquiryTopic.PARTNERSHIP ? 'orange' : 'default'}>{topic}</Tag>,
        },
        {
            title: 'Nội dung',
            dataIndex: 'message',
            key: 'message',
            render: (message: string) => message?.length > 100 ? `${message.substring(0, 100)}...` : message,
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
            render: (status: InquiryStatus) => {
                const color = status === InquiryStatus.PENDING ? 'blue' : status === InquiryStatus.IN_PROGRESS ? 'yellow' : status === InquiryStatus.RESOLVED ? 'green' : status === InquiryStatus.REJECTED ? 'red' : 'default';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: Category) => (
                <Space size="middle">
                    <Link href={`/admin/inquiries/reply/${record.id}`}>
                        <Button type="primary" size="small">
                            Trả lời
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={inquiries?.data || []}
            rowKey="id"
            pagination={tableParams.pagination}
        />
    );
};

export default InquiriesContent; 