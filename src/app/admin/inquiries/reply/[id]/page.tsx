'use client'

import { URL_CONTROLLER } from '@/contains/api';
import axios from '@/lib/axios';
import { Card, Form, Input, Select, Button, message } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import useNoti from '@/hooks/useNoti';
import Inquiry, { InquiryStatus } from '@/models/Inquiry';
import { show } from '@/apis/custom_fetch';

const { TextArea } = Input;

const EditInquiry = () => {
    const { id } = useParams();
    const router = useRouter();
    const { noti } = useNoti();
    const [form] = Form.useForm();
    const [hasReply, setHasReply] = useState(false);

    // const { data: inquiry, isLoading } = useQuery({
    //     queryKey: ['inquiry', id],
    //     queryFn: async () => {
    //         const url = URL_CONTROLLER.replace(':controller', 'inquiries') + `/${id}`;
    //         const res = await axios.get(url);
    //         return res.data;
    //     }
    // });
    const { data: inquiry, isLoading } = show<Inquiry>('inquiries', id as string, {
        load: 'user'
    })

    const mutation = useMutation({
        mutationFn: async (values: any) => {
            const url = URL_CONTROLLER.replace(':controller', 'inquiries') + `/${id}`;
            const res = await axios.put(url, values);
            return res.data;
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Cập nhật phản hồi thành công',
                type: 'success',
            });
            router.push('/admin/inquiries');
        },
        onError: (error: any) => {
            noti({
                message: 'Thất bại',
                description: error?.response?.data?.message || 'Cập nhật thất bại',
                type: 'error',
            });
        }
    });

    useEffect(() => {
        if (inquiry) {
            setHasReply(inquiry.data.admin_response !== null);
            form.setFieldsValue({
                status: inquiry.data.status,
                admin_response: inquiry.data.admin_response
            });
        }
    }, [inquiry, form]);

    const onFinish = (values: any) => {
        mutation.mutate(values);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card title="Trả lời phản hồi">
            <div className="mb-4">
                <h3>Thông tin câu hỏi</h3>
                <p><strong>Người gửi:</strong> {inquiry?.data?.user?.name}</p>
                <p><strong>Chủ đề:</strong> {inquiry?.data?.topic}</p>
                <p><strong>Nội dung:</strong> {inquiry?.data?.message}</p>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                    <Select>
                        <Select.Option value={InquiryStatus.PENDING}>Chờ xử lý</Select.Option>
                        <Select.Option value={InquiryStatus.IN_PROGRESS}>Đang xử lý</Select.Option>
                        <Select.Option value={InquiryStatus.RESOLVED}>Đã giải quyết</Select.Option>
                        <Select.Option value={InquiryStatus.REJECTED}>Từ chối</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="admin_response"
                    label="Nội dung trả lời"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung trả lời' }]}
                >
                    <TextArea rows={6} disabled={hasReply} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                        Gửi trả lời
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default EditInquiry; 