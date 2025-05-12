'use client'

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Alert, Form, Input, Button, Select, Upload } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import useNoti from '@/hooks/useNoti';
import { index } from '@/apis/custom_fetch';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { URL_CONTROLLER } from '@/contains/api';
import { UploadOutlined } from '@ant-design/icons';

export default function DocumentCreatePage() {
    const router = useRouter()
    const [form] = Form.useForm();
    const { noti } = useNoti()
    const [error, setError] = useState<string | null>(null)
    const { data: categories } = index('categories')
    const { data: users } = index('users')

    const mutationCreate = useMutation({
        mutationFn: async (data: any) => {
            const formData = new FormData();

            // Thêm các trường thông tin cơ bản
            for (const key in data) {
                if (key !== 'file' && key !== 'pdf_file') {
                    formData.append(key, data[key]);
                }
            }

            // Thêm file nếu có
            if (data.file && data.file[0]?.originFileObj) {
                formData.append('file', data.file[0].originFileObj);
            }

            if (data.pdf_file && data.pdf_file[0]?.originFileObj) {
                formData.append('pdf_file', data.pdf_file[0].originFileObj);
            }

            const url = `${URL_CONTROLLER}/documents`
            const res = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onError: (error) => {
            console.log(error)
            setError(error.message)
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Tạo tài liệu mới thành công',
                type: 'success'
            })
            router.push('/admin/documents')
        }
    })

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Tạo tài liệu mới" />
            <ComponentCard title="Thông tin tài liệu">
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical" onFinish={mutationCreate.mutate}>
                    <Form.Item label="Tiêu đề" name="title"
                        rules={[{ required: true, message: 'Tiêu đề là bắt buộc' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Danh mục" name="category_ids"
                        rules={[{ required: true, message: 'Danh mục là bắt buộc' }]}
                    >
                        <Select
                            mode='multiple'
                            allowClear
                            showSearch
                            options={categories?.data?.map((category: any) => ({ label: category.name, value: category.id })) || []} />
                    </Form.Item>

                    <Form.Item label="Tác giả" name="author_id">
                        <Select options={users?.data?.map((user: any) => ({ label: user.name, value: user.id })) || []} />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status" initialValue="pending">
                        <Select options={[
                            { label: 'Chờ duyệt', value: 'pending' },
                            { label: 'Đã duyệt', value: 'approved' },
                            { label: 'Từ chối', value: 'rejected' }
                        ]} />
                    </Form.Item>

                    <Form.Item
                        label="File gốc"
                        name="file"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'File gốc là bắt buộc' }]}
                    >
                        <Upload name="file" listType="text" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Chọn file</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="File PDF"
                        name="pdf_file"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'File PDF là bắt buộc' }]}
                    >
                        <Upload name="pdf_file" listType="text" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Tạo tài liệu mới</Button>
                    </Form.Item>
                </Form>
            </ComponentCard>
        </div>
    )
} 