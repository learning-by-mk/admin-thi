'use client'

import { index, show } from '@/apis/custom_fetch';
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { URL_CONTROLLER } from '@/contains/api';
import axios from '@/lib/axios';
import Transaction from '@/models/Transaction';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Checkbox, Form, Input, message, Select } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function TransactionShowPage() {
    const [form] = Form.useForm();
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const { transactionId } = useParams()

    const { data: transaction } = show<Transaction>('transactions', transactionId?.toString() || '', {
        load: 'user',
    })

    useEffect(() => {
        if (transaction) {
            form.setFieldsValue({
                ...transaction?.data,
                user: transaction?.data?.user?.name,
            })
        }
    }, [transaction])

    return (
        <div>
            <PageBreadcrumb pageTitle="Tạo người dùng" />
            <ComponentCard title="Thông tin người dùng">
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical">
                    {/* <Form.Item shouldUpdate>
                        {() => {
                            return <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>;
                        }}
                    </Form.Item> */}
                    <Form.Item label="Người dùng" name="user"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Số tiền" name="amount"
                        rules={[{ required: true, message: 'Số tiền là bắt buộc' }]}
                    >
                        <Input type='number' disabled />
                    </Form.Item>
                    <Form.Item label="Trạng thái" name="status">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Phương thức thanh toán" name="payment_method">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Ngày tạo" name="created_at">
                        <Input disabled />
                    </Form.Item>
                </Form>
            </ComponentCard>
        </div>
    )
}
