import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import { Card, Col, Row, Statistic } from "antd";
import { CommentOutlined, DownloadOutlined, HeartOutlined, StarOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
    title: "Quản lý tương tác",
    description: "Quản lý tất cả các tương tác của người dùng",
};

export default function InteractionsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Quản lý tương tác" />

            <div className="mb-6">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Link href="/admin/interactions/ratings" className="block w-full">
                            <Card hoverable className="text-center">
                                <Statistic
                                    title="Đánh giá"
                                    value={396}
                                    prefix={<StarOutlined className="text-yellow-500 mr-2" />}
                                />
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Link href="/admin/interactions/favorites" className="block w-full">
                            <Card hoverable className="text-center">
                                <Statistic
                                    title="Yêu thích"
                                    value={1410}
                                    prefix={<HeartOutlined className="text-red-500 mr-2" />}
                                />
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Link href="/admin/interactions/comments" className="block w-full">
                            <Card hoverable className="text-center">
                                <Statistic
                                    title="Bình luận"
                                    value={2050}
                                    prefix={<CommentOutlined className="text-blue-500 mr-2" />}
                                />
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Link href="/admin/interactions/downloads" className="block w-full">
                            <Card hoverable className="text-center">
                                <Statistic
                                    title="Tải xuống"
                                    value={4700}
                                    prefix={<DownloadOutlined className="text-green-500 mr-2" />}
                                />
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </div>

            <div className="mb-6">
                <Link href="/admin/interactions/stats" className="block w-full">
                    <Card hoverable className="text-center">
                        <h2 className="text-xl font-bold mb-4">Thống kê tương tác</h2>
                        <p className="text-gray-600">Xem thống kê chi tiết về tất cả các loại tương tác</p>
                    </Card>
                </Link>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Quản lý tương tác</h2>
                <p>
                    Hệ thống quản lý tương tác cho phép bạn theo dõi và quản lý tất cả các loại tương tác của người dùng với tài liệu trên hệ thống, bao gồm:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Đánh giá</strong>: Người dùng đánh giá chất lượng tài liệu (1-5 sao)</li>
                    <li><strong>Yêu thích</strong>: Người dùng đánh dấu các tài liệu yêu thích</li>
                    <li><strong>Bình luận</strong>: Người dùng thảo luận về tài liệu</li>
                    <li><strong>Tải xuống</strong>: Thống kê lượt tải xuống tài liệu</li>
                </ul>
                <p className="mt-4">
                    Sử dụng trang <Link href="/admin/interactions/stats" className="text-blue-500 hover:underline">Thống kê tương tác</Link> để xem báo cáo chi tiết về tất cả các loại tương tác.
                </p>
            </div>
        </div>
    );
} 