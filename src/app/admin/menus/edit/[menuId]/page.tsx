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

export default function MenuEditPage() {
    const { menuId } = useParams();
    const router = useRouter()
    const [form] = Form.useForm();
    const { noti } = useNoti()
    const [error, setError] = useState<string | null>(null)
    const { data: menu } = show<Menu>('menus', menuId?.toString() || '')
    const { data: menus } = index<Menu>('menus', {
        load: 'parent',
    })
    const mutationUpdate = useMutation({
        mutationFn: async (data: Menu) => {
            const url = URL_EDIT.replace(':controller', 'menus').replace(':id', menuId?.toString() || '')
            const res = await axios.put(url, data)
            return res.data
        },
        onError: (error) => {
            console.log(error)
            setError(error.message)
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Cập nhật người dùng thành công',
                type: 'success'
            })
            router.push('/admin/menus')
        }
    })

    useEffect(() => {
        if (menu?.data) {
            form.setFieldsValue(
                {
                    ...menu.data,
                    parent: menu?.data?.parent?.id,
                }
            )
        }
    }, [menu])

    return (
        <div>
            <PageBreadcrumb pageTitle="Cập nhật người dùng" />
            <ComponentCard title="Thông tin người dùng">
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical" onFinish={mutationUpdate.mutate} initialValues={menu?.data}>
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

                    <Form.Item label="Thứ tự" name="order" >
                        <InputNumber min={0} placeholder='Bỏ trống để tự động tăng' style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="is_active" initialValue={true} valuePropName="checked">
                        {/* <Select options={[{ label: 'Hoạt động', value: true }, { label: 'Không hoạt động', value: false }]} /> */}
                        <Checkbox />
                    </Form.Item>

                    <Form.Item>
                        <Button color="danger" variant="filled" htmlType="submit">Cập nhật menu</Button>
                    </Form.Item>
                </Form>
            </ComponentCard>
        </div>
    )
}