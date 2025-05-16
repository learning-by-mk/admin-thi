'use client'

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Alert, Form, Input, Button, Select, Checkbox, InputNumber } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useNoti from '@/hooks/useNoti';
import User from '@/models/User';
import { show, index } from '@/apis/custom_fetch';
import Role from '@/models/Role';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { URL_CONTROLLER, URL_EDIT } from '@/contains/api';
import Menu from '@/models/Menu';

export default function MenuCreatePage() {
    const router = useRouter()
    const [form] = Form.useForm();
    const { noti } = useNoti()
    const [error, setError] = useState<string | null>(null)
    const { data: menus } = index<Menu>('menus', {
        load: 'parent',
    })

    const mutationCreate = useMutation({
        mutationFn: (data: Menu) => {
            return axios.post(URL_CONTROLLER.replace(':controller', 'menus'), data)
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Tạo menu thành công',
                type: 'success'
            })
            router.push('/admin/menus')
        },
        onError: (error) => {
            setError(error.message)
        }
    })

    return (
        <div>
            <PageBreadcrumb pageTitle="Tạo menu" />
            <ComponentCard title="Thông tin menu">
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical" onFinish={mutationCreate.mutate}>
                    {/* <Form.Item shouldUpdate>
                        {() => {
                            return <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>;
                        }}
                    </Form.Item> */}
                    <Form.Item label="Tên menu" name="name"
                        rules={[{ required: true, message: 'Tên menu là bắt buộc' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Slug" name="slug"
                    >
                        <Input disabled placeholder='Tự động tạo' />
                    </Form.Item>

                    <Form.Item label="Href" name="href"
                        rules={[{ required: true, message: 'Href là bắt buộc' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Menu cha" name="parent_id">
                        <Select options={menus?.data?.map((menu: Menu) => ({ label: menu.name, value: menu.id })) || []} />
                    </Form.Item>

                    <Form.Item label="Thứ tự" name="order">
                        <InputNumber min={0} placeholder='Bỏ trống để tự động tăng' style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="is_active" initialValue={true} valuePropName="checked">
                        <Checkbox />
                    </Form.Item>

                    <Form.Item>
                        <Button color="danger" variant="filled" htmlType="submit">Tạo menu</Button>
                    </Form.Item>
                </Form>
            </ComponentCard>
        </div>
    )
}