'use client'

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Alert, Form, Input, Button, Select, Checkbox } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useNoti from '@/hooks/useNoti';
import User from '@/models/User';
import { show, index } from '@/apis/custom_fetch';
import Role from '@/models/Role';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { URL_CONTROLLER, URL_EDIT } from '@/contains/api';

export default function UserEditPage() {
    const { userId } = useParams();
    const router = useRouter()
    const [form] = Form.useForm();
    const { noti } = useNoti()
    const [error, setError] = useState<string | null>(null)
    const { data: user } = show<User>('users', userId?.toString() || '')
    const { data: roles } = index<Role>('roles')
    const mutationUpdate = useMutation({
        mutationFn: async (data: User) => {
            const url = URL_EDIT.replace(':controller', 'users').replace(':id', userId?.toString() || '')
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
            router.push('/admin/users')
        }
    })

    useEffect(() => {
        if (user?.data) {
            form.setFieldsValue(user.data)
        }
    }, [user])

    return (
        <div>
            <PageBreadcrumb pageTitle="Cập nhật người dùng" />
            <ComponentCard title="Thông tin người dùng">
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical" onFinish={mutationUpdate.mutate} initialValues={user?.data}>
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
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Xác nhận mật khẩu" name="password_confirmation"
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Vai trò" name="role" initialValue={user?.data?.roles[0]?.name}>
                        <Select options={roles?.data?.map((role: Role) => ({ label: role.name, value: role.name })) || []} />
                    </Form.Item>
                    <Form.Item label="Trạng thái" name="status" valuePropName="checked" initialValue={true}>
                        <Checkbox />
                    </Form.Item>
                    <Form.Item>
                        <Button color="danger" variant="filled" htmlType="submit">Cập nhật người dùng</Button>
                    </Form.Item>
                </Form>
            </ComponentCard>
        </div>
    )
}