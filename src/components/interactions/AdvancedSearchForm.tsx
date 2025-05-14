'use client'

import { Form, Input, Button, Select, Row, Col, Space, theme, SelectProps, DatePicker } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
const { Option } = Select;
export interface FilterList {
    label: string;
    key: string;
    type: 'select' | 'input' | 'date';
    required?: boolean;
    placeholder?: string;
    mode?: 'multiple' | 'tags';
    options?: { label: string, value: string }[];
}
const AdvancedSearchForm = ({ onFinish, filterList }: { onFinish: (values: any) => void, filterList: FilterList[] }) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);

    const formStyle: React.CSSProperties = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const Element = (props: { item: FilterList } & any) => {
        const { item, ...rest } = props;
        if (item.type === 'select') {
            return <Select showSearch allowClear mode={item?.mode} options={item?.options} {...rest} />
        }
        if (item.type === 'input') {
            return <Input placeholder={item?.placeholder} {...rest} />
        }
        if (item.type === 'date') {
            return <DatePicker {...rest} />
        }
        return null;
    };

    const getFields = () => {
        const min = filterList.length / 3 <= 1 ? filterList.length : Math.floor(filterList.length / 3) + 1;
        const count = expand ? filterList.length : min;
        const children = [];
        for (let i = 0; i < count; i++) {
            children.push(
                <Col span={8} key={filterList[i]?.key}>
                    <Form.Item
                        name={filterList[i]?.key}
                        label={filterList[i]?.label}
                        rules={[
                            {
                                required: filterList[i]?.required || true,
                            },
                        ]}
                    >
                        <Element item={filterList[i]} />
                    </Form.Item>
                </Col>
            )
        }
        return children;
    }


    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24}>{getFields()}</Row>
            <div style={{ textAlign: 'right' }}>
                <Space size="small">
                    <Button type="primary" htmlType="submit">
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() => {
                            form.resetFields();
                        }}
                    >
                        {/* Clear */}
                        Đặt lại
                    </Button>
                    <a
                        style={{ fontSize: 12 }}
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        <DownOutlined rotate={expand ? 180 : 0} /> {expand ? 'Thu gọn' : 'Mở rộng'}
                    </a>
                </Space>
            </div>
        </Form>
    );
};


export default AdvancedSearchForm;