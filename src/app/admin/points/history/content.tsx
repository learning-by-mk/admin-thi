'use client'

import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, Select, Space, Table, TableProps, Tag, Tooltip } from 'antd'
import { index } from '@/apis/custom_fetch'
import HistoryPoint from '@/models/HistoryPoint'
import User from '@/models/User'
import Link from 'next/link'
import { SearchOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { TablePaginationConfig } from 'antd/es/table'

const { RangePicker } = DatePicker

interface TableParams {
    pagination?: TablePaginationConfig;
}

export default function PointsHistoryContent() {
    const [form] = Form.useForm()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 20,
        },
    })
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        fromDate: '',
        toDate: '',
        pointsType: ''
    })

    // Lấy dữ liệu từ API
    const { data: historyPoints, isLoading } = index<HistoryPoint>('history-points', {
        load: 'user',
        sort: '-created_at',
        ...searchParams
    })

    // Lấy danh sách người dùng
    const { data: users } = index<User>('users')

    // Danh sách loại giao dịch điểm
    const pointsTypeOptions = [
        { value: 'deposit', label: 'Nạp điểm' },
        { value: 'download', label: 'Tải tài liệu' },
        { value: 'bonus', label: 'Thưởng' },
        { value: 'system', label: 'Hệ thống' },
    ]

    // Xử lý tìm kiếm
    const handleSearch = (values: any) => {
        const params: any = {
            keyword: values.keyword || '',
            pointsType: values.pointsType || ''
        }

        if (values.dateRange?.length === 2) {
            params.fromDate = values.dateRange[0].format('YYYY-MM-DD')
            params.toDate = values.dateRange[1].format('YYYY-MM-DD')
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
            fromDate: '',
            toDate: '',
            pointsType: ''
        })
    }

    // Xử lý phân trang
    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({
            pagination
        })
    }

    // Cột cho bảng lịch sử giao dịch
    const columns: TableProps<HistoryPoint>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Người dùng',
            dataIndex: ['user', 'name'],
            key: 'user_name',
            render: (text: string, record: HistoryPoint) => (
                <Link href={`/admin/points/users/${record.user_id}`}>{text}</Link>
            ),
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'user_email',
        },
        {
            title: 'Điểm',
            dataIndex: 'points',
            key: 'points',
            render: (points: number) => {
                const color = points > 0 ? 'green' : 'red'
                const prefix = points > 0 ? '+' : ''
                return <span style={{ color }}>{prefix}{points}</span>
            },
            sorter: (a, b) => a.points - b.points
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            render: (text: string) => (
                <Tooltip title={text}>
                    <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: 'Loại giao dịch',
            key: 'transaction_type',
            render: (_, record: HistoryPoint) => {
                let type = ''
                let color = ''

                if (record.description.includes('nạp')) {
                    type = 'Nạp điểm'
                    color = 'green'
                } else if (record.description.includes('tải')) {
                    type = 'Tải tài liệu'
                    color = 'red'
                } else if (record.description.includes('thưởng')) {
                    type = 'Thưởng'
                    color = 'blue'
                } else {
                    type = 'Hệ thống'
                    color = 'gray'
                }

                return (
                    <Tag color={color}>
                        {type}
                    </Tag>
                )
            },
            filters: pointsTypeOptions.map(option => ({ text: option.label, value: option.value })),
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleString('vi-VN'),
            sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            defaultSortOrder: 'descend'
        },
    ]

    return (
        <div className="space-y-6">
            {/* Form tìm kiếm */}
            <Form
                form={form}
                layout="inline"
                onFinish={handleSearch}
                className="mb-4"
            >
                <Form.Item name="keyword">
                    <Input placeholder="Tìm theo mô tả" prefix={<SearchOutlined />} style={{ width: 250 }} />
                </Form.Item>

                <Form.Item name="dateRange">
                    <RangePicker
                        placeholder={['Từ ngày', 'Đến ngày']}
                        style={{ width: 300 }}
                    />
                </Form.Item>

                <Form.Item name="pointsType">
                    <Select
                        placeholder="Loại giao dịch"
                        style={{ width: 150 }}
                        allowClear
                        options={pointsTypeOptions}
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

            {/* Các nút xuất báo cáo */}
            <div className="mb-4 flex justify-end">
                <Space>
                    <Button icon={<FilePdfOutlined />}>
                        Xuất PDF
                    </Button>
                    <Button icon={<FileExcelOutlined />}>
                        Xuất Excel
                    </Button>
                </Space>
            </div>

            {/* Bảng lịch sử giao dịch */}
            <Table
                columns={columns}
                dataSource={historyPoints?.data || []}
                loading={isLoading}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                rowKey="id"
            />
        </div>
    )
} 