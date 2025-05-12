"use client"

import { PlusOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, InputRef, message, Popconfirm, Space, Table, TableColumnType, Tag, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { AnyObject } from 'antd/es/_util/type';
import axios from '@/lib/axios';
import useNoti from '@/hooks/useNoti';
import { setNotification } from '@/redux-toolkit/slices/notificationSlice'
import TextArea from "antd/es/input/TextArea";
import { UploadFile } from "antd/es/upload/interface";
import Setting from "@/models/Setting";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux-toolkit/store/store";
import { URL_EDIT } from '@/contains/api';

interface TableSettingProps {
    dataSourceInit: Setting[];
    defaultActiveKey: string;
}

const TableSetting: React.FC<TableSettingProps> = ({ dataSourceInit, defaultActiveKey }) => {
    const [dataSource, setDataSource] = useState<Setting[]>(dataSourceInit || []);
    const [onDisplay, setOnDisplay] = useState<string>('hidden')
    const { noti } = useNoti()
    const dispatch = useDispatch<AppDispatch>()

    const [fileLists, setFileLists] = useState<Record<string, UploadFile[]>>({});

    const confirm = (record: Setting) => {
        const url = URL_EDIT.replace(":controller", 'settings').replace(':id', record?.id.toString())

        if (fileLists[record.key]) {
            record.value = (fileLists[record.key][0]?.response?.data?.url);
        }

        axios.put(url, record).then(() => {
            noti({ message: `Lưu thành công ${record?.id}`, description: `Lưu thành công ${record?.id}`, type: 'warning' })
        }).catch(err => {
            noti({ message: `Lỗi ${record?.id}`, description: err?.response?.data?.message, type: 'error' })
        })
    }

    useEffect(() => {
        if (dataSourceInit) {
            setDataSource(dataSourceInit);
        }
    }, [dataSourceInit]);

    useEffect(() => {
        const initialFileLists: Record<string, UploadFile[]> = {};
        setFileLists(initialFileLists);
    }, [dataSource]);

    const columns: TableColumnType<Setting>[] = [
        {
            title: 'Khóa',
            dataIndex: 'key',
            width: 140,
            key: 'key',
            sorter: (a: Setting, b: Setting) => a.key.localeCompare(b.key)
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            width: 280,
            key: 'value',
            sorter: (a: Setting, b: Setting) => a.value.localeCompare(b.value),
            render: (_: any, record: Setting) => {
                return <Input
                    value={record.value}
                />
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 140,
            key: 'description',
            render: (_: AnyObject, record: Setting) => {
                return record.description ?? ""
            }
        },
        {
            title: 'Hành động',
            dataIndex: "Actions",
            key: 'Actions',
            width: 140,
            render: (_: AnyObject, record: Setting) => (
                <div>
                    <Popconfirm title={"Bạn có chắc chắn lưu?"} className='mr-1' okText={'Đồng ý'} cancelText={'Hủy bỏ'}
                        onConfirm={() => {
                            confirm(record)
                        }} onCancel={() => dispatch(
                            setNotification({
                                message: "Hủy bỏ",
                                description: "Hủy bỏ",
                            })
                        )}>
                        <Button type="default" icon={<SaveOutlined />} size={"large"}
                            onClick={() => setOnDisplay(onDisplay === "hidden" ? "block" : "hidden")}
                            className='relative ant-btn-primary' />
                    </Popconfirm>
                </div>
            )
        },
    ];
    return (
        <>
            <Table dataSource={dataSource} columns={columns}
            />
        </>
    )
}

export default TableSetting;
