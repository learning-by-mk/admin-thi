'use client'

import React, { useState, useEffect } from 'react';
import { Card, Tabs, Select, DatePicker, Spin } from 'antd';
import ComponentCard from '@/components/common/ComponentCard';
import { getInteractionStats } from '@/apis/interactionStats';
import { InteractionStats } from '@/models/InteractionStats';
import dynamic from 'next/dynamic';

// Dynamic imports để tránh lỗi SSR với chart.js
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then(mod => mod.Pie), { ssr: false });

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function StatsContent() {
    const [timeRange, setTimeRange] = useState('month');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<InteractionStats | null>(null);

    useEffect(() => {
        const initChartJS = async () => {
            const {
                Chart, CategoryScale, LinearScale, PointElement,
                LineElement, BarElement, ArcElement, Title, Tooltip, Legend
            } = await import('chart.js');

            Chart.register(
                CategoryScale, LinearScale, PointElement, LineElement,
                BarElement, ArcElement, Title, Tooltip, Legend
            );
        };

        initChartJS();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getInteractionStats(timeRange);
                setStats(data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu thống kê:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    // Chuyển đổi dữ liệu cho biểu đồ Line
    const getRatingChartData = () => {
        if (!stats) return null;

        return {
            labels: stats.timeSeriesData.ratings.counts.labels,
            datasets: [
                {
                    label: 'Số lượng đánh giá',
                    data: stats.timeSeriesData.ratings.counts.values,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                    label: 'Điểm đánh giá trung bình',
                    data: stats.timeSeriesData.ratings.averageScores.values,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };
    };

    const getFavoriteChartData = () => {
        if (!stats) return null;

        return {
            labels: stats.timeSeriesData.favorites.counts.labels,
            datasets: [
                {
                    label: 'Số lượt yêu thích',
                    data: stats.timeSeriesData.favorites.counts.values,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                }
            ],
        };
    };

    const getCommentChartData = () => {
        if (!stats) return null;

        return {
            labels: stats.timeSeriesData.comments.counts.labels,
            datasets: [
                {
                    label: 'Số lượng bình luận',
                    data: stats.timeSeriesData.comments.counts.values,
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                }
            ],
        };
    };

    const getDownloadChartData = () => {
        if (!stats) return null;

        return {
            labels: stats.timeSeriesData.downloads.counts.labels,
            datasets: [
                {
                    label: 'Số lượt tải xuống',
                    data: stats.timeSeriesData.downloads.counts.values,
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                }
            ],
        };
    };

    const getDistributionChartData = () => {
        if (!stats) return null;

        return {
            labels: stats.interactionDistribution.labels,
            datasets: [
                {
                    data: stats.interactionDistribution.values,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                    ],
                    borderColor: [
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 159, 64)',
                        'rgb(153, 102, 255)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const getTopDocumentsChartData = () => {
        if (!stats) return null;

        return {
            labels: stats.topDocuments.map(doc => doc.title),
            datasets: [
                {
                    label: 'Số lượt tương tác',
                    data: stats.topDocuments.map(doc => doc.interactionCount),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
            ],
        };
    };

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center h-96">
    //             <Spin size="large" tip="Đang tải dữ liệu..." />
    //         </div>
    //     );
    // }

    if (!stats) {
        return (
            <div className="text-center py-8">
                <p>Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-4">
                <div className="flex justify-between mb-4">
                    <Select
                        defaultValue="month"
                        style={{ width: 200 }}
                        onChange={value => setTimeRange(value)}
                        options={[
                            { value: 'week', label: '7 ngày qua' },
                            { value: 'month', label: '30 ngày qua' },
                            { value: 'quarter', label: 'Quý này' },
                            { value: 'year', label: 'Năm nay' },
                            { value: 'custom', label: 'Tùy chỉnh' },
                        ]}
                    />
                    {timeRange === 'custom' && (
                        <RangePicker className="ml-4" />
                    )}
                </div>

                <ComponentCard title="Tổng quan tương tác">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Card title="Phân phối loại tương tác">
                            <Pie data={getDistributionChartData() as any} />
                        </Card>
                        <Card title="Top 5 tài liệu được tương tác nhiều nhất">
                            <Bar data={getTopDocumentsChartData() as any} />
                        </Card>
                    </div>
                </ComponentCard>

                <Tabs
                    defaultActiveKey="ratings"
                    type="card"
                    items={[
                        {
                            key: 'ratings',
                            label: 'Đánh giá',
                            children: (
                                <ComponentCard title="Thống kê đánh giá">
                                    <div className="mb-6">
                                        <Line data={getRatingChartData() as any} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tổng số đánh giá</p>
                                                <p className="text-3xl font-bold text-blue-600">{stats.summary.ratings.total}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Điểm trung bình</p>
                                                <p className="text-3xl font-bold text-green-600">{stats.summary.ratings.average}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Đánh giá mới (7 ngày)</p>
                                                <p className="text-3xl font-bold text-purple-600">{stats.summary.ratings.newCount}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tỉ lệ tăng trưởng</p>
                                                <p className="text-3xl font-bold text-red-600">+{stats.summary.ratings.growthRate}%</p>
                                            </div>
                                        </Card>
                                    </div>
                                </ComponentCard>
                            ),
                        },
                        {
                            key: 'favorites',
                            label: 'Yêu thích',
                            children: (
                                <ComponentCard title="Thống kê yêu thích">
                                    <div className="mb-6">
                                        <Line data={getFavoriteChartData() as any} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tổng số yêu thích</p>
                                                <p className="text-3xl font-bold text-blue-600">{stats.summary.favorites.total.toLocaleString()}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Yêu thích mới (7 ngày)</p>
                                                <p className="text-3xl font-bold text-green-600">{stats.summary.favorites.newCount}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">TB yêu thích/tài liệu</p>
                                                <p className="text-3xl font-bold text-purple-600">{stats.summary.favorites.averagePerDocument}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tỉ lệ tăng trưởng</p>
                                                <p className="text-3xl font-bold text-red-600">+{stats.summary.favorites.growthRate}%</p>
                                            </div>
                                        </Card>
                                    </div>
                                </ComponentCard>
                            ),
                        },
                        {
                            key: 'comments',
                            label: 'Bình luận',
                            children: (
                                <ComponentCard title="Thống kê bình luận">
                                    <div className="mb-6">
                                        <Line data={getCommentChartData() as any} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tổng số bình luận</p>
                                                <p className="text-3xl font-bold text-blue-600">{stats.summary.comments.total.toLocaleString()}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Bình luận mới (7 ngày)</p>
                                                <p className="text-3xl font-bold text-green-600">{stats.summary.comments.newCount}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">TB bình luận/tài liệu</p>
                                                <p className="text-3xl font-bold text-purple-600">{stats.summary.comments.averagePerDocument}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tỉ lệ tăng trưởng</p>
                                                <p className="text-3xl font-bold text-red-600">+{stats.summary.comments.growthRate}%</p>
                                            </div>
                                        </Card>
                                    </div>
                                </ComponentCard>
                            ),
                        },
                        {
                            key: 'downloads',
                            label: 'Tải xuống',
                            children: (
                                <ComponentCard title="Thống kê tải xuống">
                                    <div className="mb-6">
                                        <Line data={getDownloadChartData() as any} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tổng số tải xuống</p>
                                                <p className="text-3xl font-bold text-blue-600">{stats.summary.downloads.total.toLocaleString()}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tải xuống mới (7 ngày)</p>
                                                <p className="text-3xl font-bold text-green-600">{stats.summary.downloads.newCount}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">TB tải xuống/tài liệu</p>
                                                <p className="text-3xl font-bold text-purple-600">{stats.summary.downloads.averagePerDocument}</p>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="text-center">
                                                <p className="text-lg font-medium">Tỉ lệ tăng trưởng</p>
                                                <p className="text-3xl font-bold text-red-600">+{stats.summary.downloads.growthRate}%</p>
                                            </div>
                                        </Card>
                                    </div>
                                </ComponentCard>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
} 