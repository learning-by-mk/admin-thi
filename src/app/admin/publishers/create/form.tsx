'use client'

import { Button, Form, Input, Upload, message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from '@/lib/axios';
import { URL_CONTROLLER } from '@/contains/api';
import useNoti from '@/hooks/useNoti';
import { useMutation } from '@tanstack/react-query';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface FormData {
    name: string;
    logo_path: string;
    address: string;
    email: string;
    phone: string;
    website: string;
    description: string;
}

export default function CreatePublisherForm() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { noti } = useNoti();

    const mutation = useMutation({
        mutationFn: async (values: FormData) => {
            const url = URL_CONTROLLER.replace(':controller', 'publishers');
            const response = await axios.post(url, values);
            return response.data;
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Tạo nhà xuất bản thành công',
                type: 'success',
            });
            router.push('/admin/publishers');
        },
        onError: (error: any) => {
            noti({
                message: 'Thất bại',
                description: error?.response?.data?.message || 'Tạo nhà xuất bản thất bại',
                type: 'error',
            });
            setLoading(false);
        },
    });

    const onFinish = async (values: FormData) => {
        setLoading(true);

        // Nếu có upload file, tiến hành upload trước rồi lấy đường dẫn
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('file', fileList[0].originFileObj);

            try {
                const uploadUrl = URL_CONTROLLER.replace(':controller', 'upload');
                const uploadRes = await axios.post(uploadUrl, formData);
                values.logo_path = uploadRes.data.path;
                mutation.mutate(values);
            } catch (error: any) {
                noti({
                    message: 'Thất bại',
                    description: error?.response?.data?.message || 'Upload logo thất bại',
                    type: 'error',
                });
                setLoading(false);
            }
        } else {
            mutation.mutate(values);
        }
    };

    const props = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file: UploadFile) => {
            const isImage = file.type?.startsWith('image/');
            if (!isImage) {
                message.error('Bạn chỉ có thể upload file hình ảnh!');
                return false;
            }
            setFileList([file]);
            return false;
        },
        fileList,
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
                name="name"
                label="Tên nhà xuất bản"
                rules={[{ required: true, message: 'Vui lòng nhập tên nhà xuất bản' }]}
            >
                <Input placeholder="Nhập tên nhà xuất bản" />
            </Form.Item>

            <Form.Item
                name="logo"
                label="Logo"
                valuePropName="fileList"
                getValueFromEvent={() => fileList}
            >
                <Upload {...props} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload Logo</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
                <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                ]}
            >
                <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
                <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
                name="website"
                label="Website"
            >
                <Input placeholder="Nhập website (nếu có)" />
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả"
            >
                <Input.TextArea rows={4} placeholder="Nhập mô tả về nhà xuất bản" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Tạo mới
                </Button>
            </Form.Item>
        </Form>
    );
} 