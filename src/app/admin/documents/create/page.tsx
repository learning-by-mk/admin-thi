'use client'

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Alert, Form, Input, Button, Select, Upload, UploadProps } from 'antd';
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
    const [fileList, setFileList] = useState<any[]>([]);

    const { data: categories } = index('categories')
    const { data: users } = index('users')

    const handleImageChange: UploadProps['onChange'] = ({ fileList }) => setFileList(fileList);
    const mutationCreate = useMutation({
        mutationFn: async (data: any) => {

            const url = URL_CONTROLLER.replace(':controller', 'documents')
            data.file_id = fileList[0]?.response?.data?.id
            delete data.file
            console.log(data)
            const res = await axios.post(url, data);
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
                        label={"Tài liệu"}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                        rules={[{ required: true }]}
                        name="file"
                    >
                        <Upload
                            action={`/api/files`}
                            headers={{ Authorization: 'Bearer ' + localStorage.getItem('token') }}
                            data={{
                                folder: 'documents'
                            }}
                            maxCount={1}
                            progress={{
                                strokeColor: {
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                },
                                strokeWidth: 3,
                                format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                            }}
                            // fileList={fileList}
                            onChange={handleImageChange}
                            beforeUpload={(file) => {
                                const isFileAllowed = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                    || file.type === 'application/pdf'
                                    || file.type === 'text/plain'
                                    || file.type === 'application/vnd.ms-excel'
                                    || file.type === 'application/vnd.ms-powerpoint';
                                if (!isFileAllowed) {
                                    noti({
                                        message: "Lỗi!",
                                        type: "error",
                                        description: "Bạn chỉ có thể tải lên file docx/pdf/notepad/text/excel/powerpoint!"
                                    })
                                    return Upload.LIST_IGNORE;
                                }
                                return isFileAllowed;
                            }}
                        >
                            {fileList.length >= 2 ? null : (
                                <div>
                                    <Button icon={<UploadOutlined />}>Bấm để tải lên</Button>
                                </div>
                            )}
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