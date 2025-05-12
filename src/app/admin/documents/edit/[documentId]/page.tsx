'use client'

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Alert, Form, Input, Button, Select, Upload } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useNoti from '@/hooks/useNoti';
import { show, index } from '@/apis/custom_fetch';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { URL_CONTROLLER, URL_EDIT } from '@/contains/api';
import { UploadOutlined } from '@ant-design/icons';
import Category from '@/models/Category';
import Document from '@/models/Document';

export default function DocumentEditPage() {
    const { documentId } = useParams();
    const router = useRouter()
    const [form] = Form.useForm();
    const { noti } = useNoti()
    const [error, setError] = useState<string | null>(null)
    const { data: document } = show('documents', documentId?.toString() || '', {
        load: 'categories, author, uploadedBy'
    })
    const { data: categories } = index('categories')
    const { data: users } = index('users')

    const mutationUpdate = useMutation({
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

            const url = URL_EDIT.replace(':controller', 'documents').replace(':id', documentId?.toString() || '')
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
                description: 'Cập nhật tài liệu thành công',
                type: 'success'
            })
            router.push('/admin/documents')
        }
    })

    useEffect(() => {
        if (document?.data) {
            form.setFieldsValue({
                ...document.data
            })
        }
    }, [document, form])

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Cập nhật tài liệu" />
            <ComponentCard title="Thông tin tài liệu">
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical" onFinish={mutationUpdate.mutate} initialValues={{
                    ...document?.data as any,
                    category_ids: (document?.data as Document)?.categories?.map((category: Category) => category.id)
                }}>
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
                        <Select options={users?.data?.map((user: any) => ({ label: user.name, value: user.id })) || []} disabled />
                    </Form.Item>

                    <Form.Item label="Người tải lên" name="uploaded_by_id"
                    >
                        <Select options={users?.data?.map((user: any) => ({ label: user.name, value: user.id })) || []} disabled />
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
                    >
                        <Upload name="pdf_file" listType="text" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Cập nhật tài liệu</Button>
                    </Form.Item>
                </Form>
            </ComponentCard>
        </div>
    )
} 