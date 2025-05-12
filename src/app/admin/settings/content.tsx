'use client'

import User from '@/models/User'
import { Button, Popconfirm, Space, Table, TableProps, Tabs, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { index } from '@/apis/custom_fetch'
import { TablePaginationConfig } from 'antd/es/table'
import Link from 'next/link'
import axios from '@/lib/axios'
import { URL_CONTROLLER_ID } from '@/contains/api'
import useNoti from '@/hooks/useNoti'
import Role from '@/models/Role'
import { colors } from '@/contains/colorTag'
import SettingGroup from '@/models/SettingGroup'
import TableSetting from './tableSetting'
interface TableParams {
    pagination?: TablePaginationConfig;
}
export default function SettingsContent() {
    const [defaultActiveKey, setDefaultActiveKey] = useState<string>('1')

    const { data: settingGroups } = index<SettingGroup>('setting-groups', {
        load: 'settings',
    })

    const items = useMemo(() => {
        return settingGroups?.data?.map((settingGroup) => ({
            key: settingGroup.id.toString(),
            label: settingGroup.name,
            children: <TableSetting dataSourceInit={settingGroup.settings} defaultActiveKey={defaultActiveKey} />,
        })) ?? []
    }, [settingGroups, defaultActiveKey])

    useEffect(() => {
        console.log('defaultActiveKey', defaultActiveKey)
    }, [defaultActiveKey])

    useEffect(() => {
        console.log('settingGroups', settingGroups)
        if (settingGroups?.data?.length) {
            setDefaultActiveKey(settingGroups?.data[0]?.id.toString() ?? '1')
        }
    }, [settingGroups])

    return (
        <Tabs items={items} defaultActiveKey={defaultActiveKey} onChange={(key) => setDefaultActiveKey(key)} />
    )
}
