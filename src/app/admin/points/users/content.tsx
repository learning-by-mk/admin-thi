'use client'

import React, { useState } from 'react'
import { Button, Form, Input, Select, Space, Table, TableProps, Progress } from 'antd'
import { index } from '@/apis/custom_fetch'
import User from '@/models/User'
import Link from 'next/link'
import { SearchOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons'
import { TablePaginationConfig } from 'antd/es/table'

interface TableParams {
    pagination?: TablePaginationConfig;
}

export default function PointsUsersContent() {
    const [form] = Form.useForm()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 20,
        },
    })
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        status: '',
        role: ''
    })

    // Lấy dữ liệu từ API
    const { data: users, isLoading } = index<User>('users', {
        load: 'roles',
        sort: '-points',
        ...searchParams
    })

    // Tổng số người dùng có điểm
    const totalUsersWithPoints = users?.data?.filter((user: User) => (user.points || 0) > 0).length || 0

    // Tổng điểm trong hệ thống
    const totalPoints = users?.data?.reduce((acc: number, user: User) => acc + (user.points || 0), 0) || 0

    // Điểm trung bình mỗi người dùng
    const averagePoints = totalUsersWithPoints > 0 ? Math.round(totalPoints / totalUsersWithPoints) : 0

    // Các tùy chọn trạng thái người dùng
    const statusOptions = [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
        { value: 'banned', label: 'Bị cấm' }
    ]

    // Xử lý tìm kiếm
    const handleSearch = (values: any) => {
        const params: any = {
            keyword: values.keyword || '',
            status: values.status || '',
            role: values.role || ''
        }

        setSearchParams(params)
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: 1
            }
        })
    }

    // Xử lý reset form
    const handleReset = () => {
        form.resetFields()
        setSearchParams({
            keyword: '',
            status: '',
            role: ''
        })
    }

    // Xử lý phân trang
    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({
            pagination
        })
    }

    // Cột cho bảng người dùng
    const columns: TableProps<User>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: User) => (
                <Link href={`/admin/points/users/${record.id}`}>{text}</Link>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            filters: statusOptions.map(option => ({ text: option.label, value: option.value })),
            render: (status: string) => {
                let color = ''
                switch (status) {
                    case 'active':
                        color = 'green'
                        break
                    case 'inactive':
                        color = 'orange'
                        break
                    case 'banned':
                        color = 'red'
                        break
                    default:
                        color = 'default'
                }
                return (
                    <span style={{ color }}>
                        {status === 'active' ? 'Hoạt động' : status === 'inactive' ? 'Không hoạt động' : 'Bị cấm'}
                    </span>
                )
            }
        },
        {
            title: 'Điểm hiện tại',
            dataIndex: 'points',
            key: 'points',
            sorter: (a, b) => (a.points || 0) - (b.points || 0),
            defaultSortOrder: 'descend',
            render: (points: number) => (
                <span style={{ fontWeight: 'bold' }}>{points || 0}</span>
            )
        },
        {
            title: 'Mức điểm',
            key: 'points_level',
            render: (_, record: User) => {
                let percent = 0
                let color = ''

                const points = record.points || 0

                if (points > 5000) {
                    percent = 100
                    color = 'gold'
                } else if (points > 1000) {
                    percent = 80
                    color = '#52c41a'
                } else if (points > 500) {
                    percent = 60
                    color = '#1890ff'
                } else if (points > 100) {
                    percent = 40
                    color = '#faad14'
                } else {
                    percent = 20
                    color = '#bfbfbf'
                }

                return <Progress percent={percent} showInfo={false} strokeColor={color} />
            }
        },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: any[]) => roles?.map(role => role.name).join(', ') || 'Không có'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record: User) => (
                <Space size="middle">
                    <Button type="primary" icon={<HistoryOutlined />}>
                        <Link href={`/admin/points/users/${record.id}`}>Chi tiết</Link>
                    </Button>
                    <Button icon={<PlusOutlined />}>
                        <Link href={`/admin/points/users/${record.id}/add`}>Cộng điểm</Link>
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Thông tin tổng quan */}
            <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="rounded-md border p-4 shadow-sm">
                    <h3 className="text-lg font-medium">Tổng số người dùng có điểm</h3>
                    <p className="text-2xl font-bold">{totalUsersWithPoints}</p>
                </div>
                <div className="rounded-md border p-4 shadow-sm">
                    <h3 className="text-lg font-medium">Tổng điểm trong hệ thống</h3>
                    <p className="text-2xl font-bold">{totalPoints}</p>
                </div>
                <div className="rounded-md border p-4 shadow-sm">
                    <h3 className="text-lg font-medium">Điểm trung bình mỗi người dùng</h3>
                    <p className="text-2xl font-bold">{averagePoints}</p>
                </div>
            </div>

            {/* Form tìm kiếm */}
            <Form
                form={form}
                layout="inline"
                onFinish={handleSearch}
                className="mb-4"
            >
                <Form.Item name="keyword">
                    <Input placeholder="Tìm theo tên hoặc email" prefix={<SearchOutlined />} style={{ width: 250 }} />
                </Form.Item>

                <Form.Item name="status">
                    <Select
                        placeholder="Trạng thái"
                        style={{ width: 150 }}
                        allowClear
                        options={statusOptions}
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Tìm kiếm
                        </Button>
                        <Button onClick={handleReset}>
                            Xóa lọc
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            {/* Bảng người dùng */}
            <Table
                columns={columns}
                dataSource={users?.data || []}
                loading={isLoading}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                rowKey="id"
            />
        </div>
    )
} 