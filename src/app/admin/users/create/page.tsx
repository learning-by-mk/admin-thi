'use client'

import { index } from '@/apis/custom_fetch';
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { URL_CONTROLLER } from '@/contains/api';
import axios from '@/lib/axios';
import Role from '@/models/Role';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Checkbox, Form, Input, message, Select } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function UserCreatePage() {
    const [form] = Form.useForm();
    const { data: roles } = index<Role>('roles')
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const mutationCreate = useMutation({
        mutationFn: (data: any) => {
            setLoading(true)
            return axios.post(URL_CONTROLLER.replace(':controller', 'users'), data)
        },
        onSuccess: () => {
            setLoading(false)
            message.success('Tạo người dùng thành công')
            router.push('/admin/users')
        },
        onError: (error: any) => {
            setError(error.response.data.message)
            setLoading(false)
        }
    })

    return (
        <div>
            <PageBreadcrumb pageTitle="Tạo người dùng" />
            <ComponentCard title="Thông tin người dùng">
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical" onFinish={mutationCreate.mutate}>
                    {/* <Form.Item shouldUpdate>
                        {() => {
                            return <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>;
                        }}
                    </Form.Item> */}
                    <Form.Item label="Tên người dùng" name="name"
                        rules={[{ required: true, message: 'Tên người dùng là bắt buộc' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email"
                        rules={[{ required: true, message: 'Email là bắt buộc' }]}
                    >
                        <Input type='email' />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password"
                        rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Xác nhận mật khẩu" name="password_confirmation"
                        rules={[{ required: true, message: 'Xác nhận mật khẩu là bắt buộc' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Vai trò" name="role">
                        <Select options={roles?.data?.map((role: Role) => ({ label: role.name, value: role.name })) || []} />
                    </Form.Item>
                    <Form.Item label="Trạng thái" name="status" valuePropName="checked" initialValue={true}>
                        <Checkbox />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Tạo người dùng</Button>
                    </Form.Item>
                </Form>
            </ComponentCard>
        </div>
    )
}
