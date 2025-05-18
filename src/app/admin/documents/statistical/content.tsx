'use client'

import React, { useState } from 'react'
import { Button, Form, Input, Select, Space, Table, TableProps, Progress, Card, Tag } from 'antd'
import { index } from '@/apis/custom_fetch'
import Price from '@/models/Price'
import Link from 'next/link'
import { SearchOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons'
import { TablePaginationConfig } from 'antd/es/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface TableParams {
    pagination?: TablePaginationConfig;
}

export default function DocumentsStatisticalContent() {
    const [form] = Form.useForm()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 20,
        },
    })
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        is_free: '',
        min_points: '',
        max_points: ''
    })

    // Lấy dữ liệu từ API
    const { data: prices, isLoading } = index<Price>('prices', {
        load: 'document',
        sort: '-points',
        ...searchParams
    })

    // Tính các thống kê
    const totalPrices = prices?.data?.length || 0
    const totalFreeDocuments = prices?.data?.filter((price: Price) => price.is_free).length || 0
    const totalPaidDocuments = totalPrices - totalFreeDocuments
    const averagePoints = totalPaidDocuments > 0
        ? Math.round((prices?.data?.filter((price: Price) => !price.is_free).reduce((acc: number, price: Price) => acc + price.points, 0) || 0) / totalPaidDocuments)
        : 0

    // Các tùy chọn trạng thái tài liệu
    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'true', label: 'Miễn phí' },
        { value: 'false', label: 'Có tính phí' }
    ]

    // Dữ liệu cho biểu đồ phân bố điểm
    const pointsDistribution = [
        { name: '0 điểm (Miễn phí)', value: totalFreeDocuments },
        { name: '1-100 điểm', value: prices?.data?.filter((price: Price) => !price.is_free && price.points > 0 && price.points <= 100).length || 0 },
        { name: '101-200 điểm', value: prices?.data?.filter((price: Price) => price.points > 100 && price.points <= 200).length || 0 },
        { name: '201-500 điểm', value: prices?.data?.filter((price: Price) => price.points > 200 && price.points <= 500).length || 0 },
        { name: '>500 điểm', value: prices?.data?.filter((price: Price) => price.points > 500).length || 0 }
    ]

    // Màu cho biểu đồ tròn
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

    // Dữ liệu cho biểu đồ top tài liệu có giá điểm cao nhất
    const topDocumentsData = prices?.data
        ?.filter((price: Price) => !price.is_free)
        .sort((a: Price, b: Price) => b.points - a.points)
        .slice(0, 10)
        .map((price: Price) => ({
            name: price.document?.title?.substring(0, 20) + '...' || 'Không tên',
            points: price.points
        })) || []

    // Xử lý tìm kiếm
    const handleSearch = (values: any) => {
        const params: any = {
            keyword: values.keyword || '',
            min_points: values.min_points || '',
            max_points: values.max_points || ''
        }

        if (values.is_free && values.is_free !== 'all') {
            params.is_free = values.is_free === 'true'
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
            is_free: '',
            min_points: '',
            max_points: ''
        })
    }

    // Xử lý phân trang
    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({
            pagination
        })
    }

    // Cột cho bảng tài liệu
    const columns: TableProps<Price>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tài liệu',
            dataIndex: ['document', 'title'],
            key: 'document_title',
            render: (text: string, record: Price) => (
                <Link href={`/admin/documents/${record.document_id}`}>{text}</Link>
            ),
        },
        {
            title: 'Loại',
            key: 'is_free',
            dataIndex: 'is_free',
            render: (isFree: boolean) => (
                <Tag color={isFree ? 'green' : 'blue'}>
                    {isFree ? 'Miễn phí' : 'Có phí'}
                </Tag>
            ),
            filters: [
                { text: 'Miễn phí', value: true },
                { text: 'Có phí', value: false },
            ],
            onFilter: (value: any, record: Price) => record.is_free === value,
        },
        {
            title: 'Điểm yêu cầu',
            dataIndex: 'points',
            key: 'points',
            sorter: (a, b) => a.points - b.points,
            defaultSortOrder: 'descend',
            render: (points: number, record: Price) => (
                record.is_free ? <span>0 (Miễn phí)</span> : <span style={{ fontWeight: 'bold' }}>{points}</span>
            )
        },
        {
            title: 'Mức điểm',
            key: 'points_level',
            render: (_, record: Price) => {
                if (record.is_free) return <Progress percent={0} showInfo={false} strokeColor="#bfbfbf" />

                let percent = 0
                let color = ''

                const points = record.points

                if (points > 500) {
                    percent = 100
                    color = '#cf1322'
                } else if (points > 200) {
                    percent = 80
                    color = '#faad14'
                } else if (points > 100) {
                    percent = 60
                    color = '#1890ff'
                } else if (points > 50) {
                    percent = 40
                    color = '#52c41a'
                } else {
                    percent = 20
                    color = '#bfbfbf'
                }

                return <Progress percent={percent} showInfo={false} strokeColor={color} />
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record: Price) => (
                <Space size="middle">
                    <Button type="primary" icon={<FileTextOutlined />}>
                        <Link href={`/admin/documents/${record.document_id}`}>Xem tài liệu</Link>
                    </Button>
                    <Button icon={<BarChartOutlined />}>
                        <Link href={`/admin/documents/${record.document_id}/statistics`}>Thống kê tải</Link>
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Thông tin tổng quan */}
            <div className="mb-4 grid grid-cols-4 gap-4">
                <div className="rounded-md border p-4 shadow-sm">
                    <h3 className="text-lg font-medium">Tổng số tài liệu</h3>
                    <p className="text-2xl font-bold">{totalPrices}</p>
                </div>
                <div className="rounded-md border p-4 shadow-sm">
                    <h3 className="text-lg font-medium">Tài liệu miễn phí</h3>
                    <p className="text-2xl font-bold">{totalFreeDocuments}</p>
                </div>
                <div className="rounded-md border p-4 shadow-sm">
                    <h3 className="text-lg font-medium">Tài liệu có phí</h3>
                    <p className="text-2xl font-bold">{totalPaidDocuments}</p>
                </div>
                <div className="rounded-md border p-4 shadow-sm">
                    <h3 className="text-lg font-medium">Điểm trung bình</h3>
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
                    <Input placeholder="Tìm theo tên tài liệu" prefix={<SearchOutlined />} style={{ width: 250 }} />
                </Form.Item>

                <Form.Item name="is_free">
                    <Select
                        placeholder="Loại tài liệu"
                        style={{ width: 150 }}
                        allowClear
                        options={statusOptions}
                    />
                </Form.Item>

                <Form.Item name="min_points">
                    <Input type="number" placeholder="Điểm tối thiểu" style={{ width: 120 }} />
                </Form.Item>

                <Form.Item name="max_points">
                    <Input type="number" placeholder="Điểm tối đa" style={{ width: 120 }} />
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

            {/* Biểu đồ */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Biểu đồ phân bố điểm */}
                <Card title="Phân bố điểm của tài liệu">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pointsDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pointsDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Biểu đồ top tài liệu */}
                <Card title="Top 10 tài liệu có giá điểm cao nhất">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={topDocumentsData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="points" fill="#8884d8" name="Điểm" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Bảng tài liệu */}
            <Table
                columns={columns}
                dataSource={prices?.data || []}
                loading={isLoading}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                rowKey="id"
            />
        </div>
    )
} 