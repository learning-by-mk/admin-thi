'use client'

import React, { useState } from 'react'
import { Button, Card, DatePicker, Descriptions, Form, Input, Modal, Statistic, Table, TableProps, Tabs, Timeline, Spin, Tooltip } from 'antd'
import { index, show } from '@/apis/custom_fetch'
import User from '@/models/User'
import HistoryPoint from '@/models/HistoryPoint'
import { CreditCardOutlined, PlusOutlined, MinusOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { TablePaginationConfig } from 'antd/es/table'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'
import axios from '@/lib/axios'
import { URL_CONTROLLER } from '@/contains/api'
import useNoti from '@/hooks/useNoti'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const { RangePicker } = DatePicker

interface UserPointsDetailProps {
    id: string;
}

interface TableParams {
    pagination?: TablePaginationConfig;
}

export default function UserPointsDetail({ id }: UserPointsDetailProps) {
    const { noti } = useNoti()
    const queryClient = useQueryClient()
    const [form] = Form.useForm()
    const [isAddModalVisible, setIsAddModalVisible] = useState(false)
    const [isSubtractModalVisible, setIsSubtractModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    })
    const [searchParams, setSearchParams] = useState({
        fromDate: '',
        toDate: '',
        user_id: id
    })

    // Lấy dữ liệu từ API
    const { data: user, isLoading: isLoadingUser } = show<User>('users', id)
    const { data: historyPoints, isLoading: isLoadingHistory } = index<HistoryPoint>('/users/history_points/show', {
        load: 'user',
        sort: '-created_at',
        ...searchParams
    })

    // Tổng số điểm đã nạp
    const totalPointsAdded = historyPoints?.data?.reduce((acc: number, history: HistoryPoint) => {
        return history.points > 0 ? acc + history.points : acc
    }, 0) || 0

    // Tổng số điểm đã sử dụng
    const totalPointsUsed = historyPoints?.data?.reduce((acc: number, history: HistoryPoint) => {
        return history.points < 0 ? acc + Math.abs(history.points) : acc
    }, 0) || 0

    // Xử lý tìm kiếm
    const handleSearch = (values: any) => {
        const params: any = {
            user_id: id
        }

        if (values.dateRange?.length === 2) {
            params.fromDate = values.dateRange[0].format('YYYY-MM-DD')
            params.toDate = values.dateRange[1].format('YYYY-MM-DD')
        }

        setSearchParams(params)
    }

    // Xử lý reset form
    const handleReset = () => {
        form.resetFields()
        setSearchParams({
            fromDate: '',
            toDate: '',
            user_id: id
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
            title: 'Điểm',
            dataIndex: 'points',
            key: 'points',
            render: (points: number) => {
                const color = points > 0 ? 'green' : 'red'
                const prefix = points > 0 ? '+' : ''
                return <span style={{ color, fontWeight: 'bold' }}>{prefix}{points}</span>
            },
            sorter: (a, b) => a.points - b.points
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 400,
            render: (text: string) => (
                <Tooltip title={text}>
                    <div style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {text}
                    </div>
                </Tooltip>
            )
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

    // Dữ liệu cho biểu đồ lịch sử điểm
    const chartData = historyPoints?.data ? historyPoints.data.slice(0, 20).map((history: HistoryPoint) => {
        return {
            time: new Date(history.created_at).toLocaleDateString('vi-VN'),
            points: history.points,
            balance: user?.data?.points || 0 // Giả lập số dư, thực tế cần tính toán dựa trên ngày tạo
        }
    }).reverse() : []

    // Mutation để cộng điểm
    const addPointsMutation = useMutation({
        mutationFn: async (data: { points: number, description: string }) => {
            const url = URL_CONTROLLER.replace(':controller', 'users') + `/${id}/add-points`;
            const response = await axios.post(url, data);
            return response.data;
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Cộng điểm thành công',
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['users', id] });
            queryClient.invalidateQueries({ queryKey: ['history-points'] });
            setIsAddModalVisible(false);
            form.resetFields();
        },
        onError: (error: any) => {
            noti({
                message: 'Thất bại',
                description: error?.response?.data?.message || 'Cộng điểm thất bại',
                type: 'error',
            });
            setLoading(false);
        },
    });

    // Mutation để trừ điểm
    const subtractPointsMutation = useMutation({
        mutationFn: async (data: { points: number, description: string }) => {
            const url = URL_CONTROLLER.replace(':controller', 'users') + `/${id}/subtract-points`;
            const response = await axios.post(url, data);
            return response.data;
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Trừ điểm thành công',
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['users', id] });
            queryClient.invalidateQueries({ queryKey: ['history-points'] });
            setIsSubtractModalVisible(false);
            form.resetFields();
        },
        onError: (error: any) => {
            noti({
                message: 'Thất bại',
                description: error?.response?.data?.message || 'Trừ điểm thất bại',
                type: 'error',
            });
            setLoading(false);
        },
    });

    // Xử lý cộng điểm
    const handleAddPoints = (values: any) => {
        setLoading(true);
        addPointsMutation.mutate({
            points: values.points,
            description: values.description
        });
    };

    // Xử lý trừ điểm
    const handleSubtractPoints = (values: any) => {
        setLoading(true);
        subtractPointsMutation.mutate({
            points: values.points,
            description: values.description
        });
    };

    if (isLoadingUser) {
        return <Spin size="large" />
    }

    return (
        <div className="space-y-6">
            {/* Thông tin người dùng */}
            <Descriptions
                title={`Thông tin người dùng: ${user?.data?.name}`}
                bordered
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="ID">{user?.data?.id}</Descriptions.Item>
                <Descriptions.Item label="Email">{user?.data?.email}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{user?.data?.status}</Descriptions.Item>
                <Descriptions.Item label="Ngày đăng ký">{new Date(user?.data?.created_at || '').toLocaleDateString('vi-VN')}</Descriptions.Item>
            </Descriptions>

            {/* Thống kê điểm số */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <Statistic
                        title="Số điểm hiện tại"
                        value={user?.data?.points || 0}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<CreditCardOutlined />}
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Tổng điểm đã nạp"
                        value={totalPointsAdded}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<PlusOutlined />}
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Tổng điểm đã sử dụng"
                        value={totalPointsUsed}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<MinusOutlined />}
                    />
                </Card>
            </div>

            {/* Nút thao tác */}
            <div className="mb-4 flex justify-end">
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)} className="mr-2">
                    Cộng điểm
                </Button>
                <Button danger icon={<MinusOutlined />} onClick={() => setIsSubtractModalVisible(true)}>
                    Trừ điểm
                </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultActiveKey="history" items={[
                {
                    key: 'history',
                    label: 'Lịch sử giao dịch',
                    children: (
                        <div className="space-y-4">
                            {/* Form tìm kiếm */}
                            <Form
                                form={form}
                                layout="inline"
                                onFinish={handleSearch}
                                className="mb-4"
                            >
                                <Form.Item name="dateRange">
                                    <RangePicker
                                        placeholder={['Từ ngày', 'Đến ngày']}
                                        style={{ width: 300 }}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Tìm kiếm
                                    </Button>
                                    <Button onClick={handleReset} className="ml-2">
                                        Xóa lọc
                                    </Button>
                                </Form.Item>
                            </Form>

                            {/* Bảng lịch sử giao dịch */}
                            <Table
                                columns={columns}
                                dataSource={historyPoints?.data || []}
                                loading={isLoadingHistory}
                                pagination={tableParams.pagination}
                                onChange={handleTableChange}
                                rowKey="id"
                            />
                        </div>
                    ),
                },
                {
                    key: 'chart',
                    label: 'Biểu đồ điểm',
                    children: (
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="points" stroke="#8884d8" name="Điểm giao dịch" dot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ),
                },
                {
                    key: 'timeline',
                    label: 'Dòng thời gian',
                    children: (
                        <Timeline
                            mode="left"
                            items={historyPoints?.data?.slice(0, 10).map((history: HistoryPoint) => {
                                const color = history.points > 0 ? 'green' : 'red';
                                const prefix = history.points > 0 ? '+' : '';

                                return {
                                    color: color,
                                    label: new Date(history.created_at).toLocaleString('vi-VN'),
                                    children: (
                                        <div>
                                            <p><strong>Điểm: {prefix}{history.points}</strong></p>
                                            <p>{history.description}</p>
                                        </div>
                                    )
                                };
                            }) || []}
                        />
                    ),
                },
            ]} />

            {/* Modal cộng điểm */}
            <Modal
                title="Cộng điểm cho người dùng"
                open={isAddModalVisible}
                footer={null}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddPoints}
                >
                    <Form.Item
                        name="points"
                        label="Số điểm"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điểm' },
                            { type: 'number', min: 1, message: 'Số điểm phải lớn hơn 0' }
                        ]}
                    >
                        <Input type="number" placeholder="Nhập số điểm cần cộng" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Cộng điểm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal trừ điểm */}
            <Modal
                title="Trừ điểm của người dùng"
                open={isSubtractModalVisible}
                footer={null}
                onCancel={() => setIsSubtractModalVisible(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={handleSubtractPoints}
                >
                    <Form.Item
                        name="points"
                        label="Số điểm"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điểm' },
                            { type: 'number', min: 1, message: 'Số điểm phải lớn hơn 0' },
                            {
                                validator: (_, value) => {
                                    if (value > (user?.data?.points || 0)) {
                                        return Promise.reject('Số điểm trừ không thể lớn hơn số điểm hiện có');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input type="number" placeholder="Nhập số điểm cần trừ" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Form.Item>
                        <Button danger htmlType="submit" loading={loading}>
                            Trừ điểm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
} 