'use client'

import React, { useState } from 'react'
import { Card, Col, Row, Statistic, Table, TableProps, Button, Space } from 'antd'
import { index } from '@/apis/custom_fetch'
import User from '@/models/User'
import HistoryPoint from '@/models/HistoryPoint'
import { ArrowDownOutlined, ArrowUpOutlined, FileTextOutlined, UserOutlined, HistoryOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Price from '@/models/Price'
import Document from '@/models/Document'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts'
import Purchase from '@/models/Purchase'

export default function PointsContent() {
    // Lấy dữ liệu từ API
    const { data: users } = index<User>('users')
    const { data: historyPoints } = index<HistoryPoint>('history_points', {
        load: 'user',
        limit: 5,
        sort: '-created_at'
    })
    const { data: prices } = index<Price>('document_prices', {
        load: 'document',
        limit: 100
    })

    const { data: purchases } = index<Purchase>('purchases', {
        load: 'user',
        limit: 100,
        sort: '-created_at'
    })

    // Tính tổng số điểm trong hệ thống
    const totalPoints = users?.data?.reduce((acc: number, user: User) => acc + (user.points || 0), 0) || 0

    // Tính tổng số điểm đã sử dụng
    const totalPointsUsed = historyPoints?.data?.reduce((acc: number, history: HistoryPoint) => {
        // Điểm âm là điểm đã sử dụng (trừ đi)
        return history.points < 0 ? acc + Math.abs(history.points) : acc
    }, 0) || 0

    // Tính tổng số điểm đã nạp
    const totalPointsAdded = historyPoints?.data?.reduce((acc: number, history: HistoryPoint) => {
        // Điểm dương là điểm đã nạp
        return history.points > 0 ? acc + history.points : acc
    }, 0) || 0

    // Top người dùng có nhiều điểm nhất
    const topUsers = users?.data?.slice()
        .sort((a: User, b: User) => (b.points || 0) - (a.points || 0))
        .slice(0, 5) || []

    // Top tài liệu có giá điểm cao nhất
    const topDocuments = prices?.data?.slice()
        .filter((price: Price) => !price.is_free)
        .sort((a: Price, b: Price) => b.points - a.points)
        .slice(0, 5) || []

    // Dữ liệu cho biểu đồ phân bố điểm
    const pointsDistribution = [
        { name: 'Người dùng có 0-100 điểm', value: users?.data?.filter((user: User) => (user.points || 0) >= 0 && (user.points || 0) <= 100).length || 0 },
        { name: 'Người dùng có 101-500 điểm', value: users?.data?.filter((user: User) => (user.points || 0) > 100 && (user.points || 0) <= 500).length || 0 },
        { name: 'Người dùng có 501-1000 điểm', value: users?.data?.filter((user: User) => (user.points || 0) > 500 && (user.points || 0) <= 1000).length || 0 },
        { name: 'Người dùng có >1000 điểm', value: users?.data?.filter((user: User) => (user.points || 0) > 1000).length || 0 },
    ]

    // Màu cho biểu đồ tròn
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        // return {
        //     date: date.toLocaleDateString('vi-VN'),
        //     pointsAdded: purchases?.data?.filter((purchase: Purchase) => new Date(purchase.created_at).toLocaleDateString('vi-VN') === date.toLocaleDateString('vi-VN')).reduce((acc: number, purchase: Purchase) => acc + purchase.points, 0) || 0,
        //     pointsUsed: 0
        // }
        return {
            date: date.toLocaleDateString('vi-VN'),
            pointsAdded: Math.floor(Math.random() * 1000),
            pointsUsed: -Math.floor(Math.random() * 500)
        }
    })

    // Cột cho bảng lịch sử giao dịch gần đây
    const historyColumns: TableProps<HistoryPoint>['columns'] = [
        {
            title: 'Người dùng',
            dataIndex: ['user', 'name'],
            key: 'user_name',
            render: (text: string, record: HistoryPoint) => (
                <Link href={`/admin/points/users/${record.user_id}`}>{text}</Link>
            ),
        },
        {
            title: 'Điểm',
            dataIndex: 'points',
            key: 'points',
            render: (points: number) => {
                const color = points > 0 ? 'green' : 'red'
                const prefix = points > 0 ? '+' : ''
                return <span style={{ color }}>{prefix}{points}</span>
            }
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleString('vi-VN')
        },
    ]

    // Cột cho bảng top người dùng
    const userColumns: TableProps<User>['columns'] = [
        {
            title: 'Người dùng',
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
            title: 'Số điểm',
            dataIndex: 'points',
            key: 'points',
        }
    ]

    // Cột cho bảng top tài liệu
    const priceColumns: TableProps<Price>['columns'] = [
        {
            title: 'Tài liệu',
            dataIndex: ['document', 'title'],
            key: 'document_title',
            render: (text: string, record: Price) => (
                <Link href={`/admin/documents/${record.document_id}`}>{text}</Link>
            ),
        },
        {
            title: 'Số điểm',
            dataIndex: 'points',
            key: 'points',
        }
    ]

    return (
        <div className="space-y-6">
            {/* Thống kê số liệu */}
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số điểm trong hệ thống"
                            value={totalPoints}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số điểm đã nạp"
                            value={totalPointsAdded}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số điểm đã sử dụng"
                            value={totalPointsUsed}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Nút chuyển đến các trang khác */}
            <Row className="my-4">
                <Space>
                    <Button type="primary" icon={<HistoryOutlined />}>
                        <Link href="/admin/points/history">Xem lịch sử giao dịch</Link>
                    </Button>
                    <Button type="default" icon={<UserOutlined />}>
                        <Link href="/admin/points/users">Thống kê theo người dùng</Link>
                    </Button>
                    <Button type="default" icon={<FileTextOutlined />}>
                        <Link href="/admin/points/documents">Thống kê theo tài liệu</Link>
                    </Button>
                </Space>
            </Row>

            {/* Biểu đồ biến động điểm 7 ngày qua */}
            <Card title="Biến động điểm 7 ngày qua">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart
                            data={last7Days}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="pointsAdded" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Điểm nạp vào" />
                            <Area type="monotone" dataKey="pointsUsed" stackId="1" stroke="#8884d8" fill="#8884d8" name="Điểm sử dụng" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Row gutter={16}>
                {/* Phân bố điểm người dùng */}
                <Col span={12}>
                    <Card title="Phân bố điểm người dùng">
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
                </Col>

                {/* Lịch sử giao dịch gần đây */}
                <Col span={12}>
                    <Card title="Lịch sử giao dịch gần đây">
                        <Table
                            columns={historyColumns}
                            dataSource={historyPoints?.data || []}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                {/* Top người dùng có nhiều điểm */}
                <Col span={12}>
                    <Card title="Top người dùng có nhiều điểm">
                        <Table
                            columns={userColumns}
                            dataSource={topUsers}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                {/* Top tài liệu có giá điểm cao */}
                <Col span={12}>
                    <Card title="Top tài liệu có giá điểm cao">
                        <Table
                            columns={priceColumns}
                            dataSource={topDocuments}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
} 