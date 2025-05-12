'use client'

import Category from "@/models/Category";
import { Table, TablePaginationConfig } from "antd";
import { useState } from "react";

interface TableParams {
    pagination?: TablePaginationConfig;
}

export default function DocumentContent() {
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 100,
        },
    });
    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tác giả',
            dataIndex: ['author', 'name'],
            key: 'author',
        },
        {
            title: 'Phân loại',
            dataIndex: 'categories',
            key: 'categories',
            render: (categories: Category[]) => categories.map(category => category.name).join(', '),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
    ]

    return (
        <Table columns={columns} dataSource={[]} pagination={tableParams.pagination} />
    )
}