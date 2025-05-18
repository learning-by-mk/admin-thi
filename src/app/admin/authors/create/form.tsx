'use client'

import { Button, Form, Input, Select, message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from '@/lib/axios';
import { URL_CONTROLLER } from '@/contains/api';
import { index } from '@/apis/custom_fetch';
import User from '@/models/User';
import useNoti from '@/hooks/useNoti';
import { useMutation } from '@tanstack/react-query';

interface FormData {
    user_id: number;
    biography: string;
    education: string;
    specialization: string;
    awards: string;
}

export default function CreateAuthorForm() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { noti } = useNoti();
    const { data: users } = index<User>('users');

    const mutation = useMutation({
        mutationFn: async (values: FormData) => {
            const url = URL_CONTROLLER.replace(':controller', 'authors');
            const response = await axios.post(url, values);
            return response.data;
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Tạo tác giả thành công',
                type: 'success',
            });
            router.push('/admin/authors');
        },
        onError: (error: any) => {
            noti({
                message: 'Thất bại',
                description: error?.response?.data?.message || 'Tạo tác giả thất bại',
                type: 'error',
            });
            setLoading(false);
        },
    });

    const onFinish = async (values: FormData) => {
        setLoading(true);
        mutation.mutate(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="space-y-4"
        >
            <Form.Item
                name="user_id"
                label="Người dùng"
                rules={[{ required: true, message: 'Vui lòng chọn người dùng' }]}
            >
                <Select
                    placeholder="Chọn người dùng"
                    options={users?.data?.map((user: User) => ({
                        value: user.id,
                        label: user.name
                    }))}
                />
            </Form.Item>

            <Form.Item
                name="biography"
                label="Tiểu sử"
                rules={[{ required: true, message: 'Vui lòng nhập tiểu sử' }]}
            >
                <Input.TextArea rows={4} placeholder="Nhập tiểu sử tác giả" />
            </Form.Item>

            <Form.Item
                name="education"
                label="Học vấn"
                rules={[{ required: true, message: 'Vui lòng nhập học vấn' }]}
            >
                <Input placeholder="Nhập học vấn" />
            </Form.Item>

            <Form.Item
                name="specialization"
                label="Chuyên ngành"
                rules={[{ required: true, message: 'Vui lòng nhập chuyên ngành' }]}
            >
                <Input placeholder="Nhập chuyên ngành" />
            </Form.Item>

            <Form.Item
                name="awards"
                label="Giải thưởng"
            >
                <Input.TextArea rows={4} placeholder="Nhập các giải thưởng (nếu có)" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Tạo mới
                </Button>
            </Form.Item>
        </Form>
    );
} 