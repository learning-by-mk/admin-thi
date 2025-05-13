'use client'

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Alert, Form, Input, Button, Select, Space } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useNoti from '@/hooks/useNoti';
import { show } from '@/apis/custom_fetch';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { URL_EDIT } from '@/contains/api';
import { iconKeys } from '@/contains/icon';
import iconComponents from '@/contains/icon';

const renderIcon = (iconName: string, props = {}) => {
    const IconComponent = iconComponents[iconName];
    return <IconComponent {...props} />;
};
export default function CategoryEditPage() {
    const { categoryId } = useParams();
    const router = useRouter()
    const [form] = Form.useForm();
    const { noti } = useNoti()
    const [error, setError] = useState<string | null>(null)
    const { data: category } = show('categories', categoryId?.toString() || '')

    const mutationUpdate = useMutation({
        mutationFn: async (data: any) => {
            const url = URL_EDIT.replace(':controller', 'categories').replace(':id', categoryId?.toString() || '')
            const res = await axios.put(url, data);
            return res.data;
        },
        onError: (error) => {
            console.log(error);
            setError(error.message);
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Cập nhật danh mục thành công',
                type: 'success'
            });
            router.push('/admin/categories');
        }
    });

    useEffect(() => {
        if (category?.data) {
            form.setFieldsValue({
                ...category.data
            });
        }
    }, [category, form]);

    return (
        <div>
            <PageBreadcrumb pageTitle="Cập nhật danh mục" />
            <ComponentCard title="Thông tin danh mục">
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical" onFinish={mutationUpdate.mutate} initialValues={category?.data as any}>
                    <Form.Item label="Tên danh mục" name="name"
                        rules={[{ required: true, message: 'Tên danh mục là bắt buộc' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Icon" name="icon">
                        <Select
                            showSearch
                            options={iconKeys.map(icon => ({ label: icon, value: icon }))}
                            optionRender={(option) => <Space>{renderIcon(option.data.value)} {option.label}</Space>}
                        />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status" initialValue="active">
                        <Select options={[
                            { label: 'Hoạt động', value: 'active' },
                            { label: 'Không hoạt động', value: 'inactive' }
                        ]} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Cập nhật danh mục</Button>
                    </Form.Item>
                </Form>
            </ComponentCard>
        </div>
    )
} 