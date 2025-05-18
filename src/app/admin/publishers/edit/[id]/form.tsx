'use client'

import { Button, Form, Input, Upload, message, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { URL_CONTROLLER, URL_CONTROLLER_ID } from '@/contains/api';
import { show } from '@/apis/custom_fetch';
import Publisher from '@/models/Publisher';
import useNoti from '@/hooks/useNoti';
import { useMutation } from '@tanstack/react-query';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import Image from 'next/image';

interface FormData {
    name: string;
    logo_path: string;
    address: string;
    email: string;
    phone: string;
    website: string;
    description: string;
}

interface EditPublisherFormProps {
    id: string;
}

export default function EditPublisherForm({ id }: EditPublisherFormProps) {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { noti } = useNoti();
    const { data: publisher, isLoading } = show<Publisher>('publishers', id);

    useEffect(() => {
        if (publisher && publisher.data) {
            form.setFieldsValue({
                name: publisher.data.name,
                address: publisher.data.address,
                email: publisher.data.email,
                phone: publisher.data.phone,
                website: publisher.data.website,
                description: publisher.data.description,
            });

            if (publisher.data.logo_path) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'Logo hiện tại',
                        status: 'done',
                        url: publisher.data.logo_path,
                    } as UploadFile,
                ]);
            }
        }
    }, [publisher, form]);

    const mutation = useMutation({
        mutationFn: async (values: FormData) => {
            const url = URL_CONTROLLER_ID.replace(':controller', 'publishers').replace(':id', id);
            const response = await axios.put(url, values);
            return response.data;
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Cập nhật nhà xuất bản thành công',
                type: 'success',
            });
            router.push('/admin/publishers');
        },
        onError: (error: any) => {
            noti({
                message: 'Thất bại',
                description: error?.response?.data?.message || 'Cập nhật nhà xuất bản thất bại',
                type: 'error',
            });
            setLoading(false);
        },
    });

    const onFinish = async (values: FormData) => {
        setLoading(true);

        // Nếu có upload file mới, tiến hành upload trước rồi lấy đường dẫn
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
        } else if (fileList.length > 0 && fileList[0].url) {
            // Giữ nguyên logo hiện tại
            values.logo_path = fileList[0].url;
            mutation.mutate(values);
        } else {
            // Không có logo
            values.logo_path = '';
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

    if (isLoading) {
        return <Skeleton active />;
    }

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

            {publisher?.data?.logo_path && !fileList.length && (
                <div className="mb-4">
                    <p className="mb-2">Logo hiện tại:</p>
                    <Image src={publisher.data.logo_path} alt="Logo hiện tại" width={100} height={100} />
                </div>
            )}

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
                    Cập nhật
                </Button>
            </Form.Item>
        </Form>
    );
} 