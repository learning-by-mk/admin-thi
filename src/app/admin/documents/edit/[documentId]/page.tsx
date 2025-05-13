'use client'

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Alert, Form, Input, Button, Select, Upload, Space, UploadProps, UploadFile, Image } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useNoti from '@/hooks/useNoti';
import { show, index } from '@/apis/custom_fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { URL_EDIT } from '@/contains/api';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Category from '@/models/Category';
import Document from '@/models/Document';
import { getBase64 } from '@/lib/functions';
import { RcFile } from 'antd/es/upload';
const editorStyle = {
    width: '80%',
    height: '500px',
    transition: 'height 0.3s ease-in-out',
    marginBottom: '70px'
};
const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }, 'blockquote', 'code-block'],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'code-block', 'script'
];
export default function DocumentEditPage() {
    const { documentId } = useParams();
    const router = useRouter()
    const [form] = Form.useForm();
    const { noti } = useNoti()
    const [error, setError] = useState<string | null>(null)
    const [fileList, setFileList] = useState<any[]>([]);
    const [imageList, setImageList] = useState<any[]>([]);
    const queryClient = useQueryClient()
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const { data: document } = show<Document>('documents', documentId?.toString() || '', {
        load: 'categories, author, uploadedBy, file, image'
    })
    const { data: categories } = index('categories')
    const { data: users } = index('users')

    const [contentPost, setContentPost] = useState<string>('');
    const handleChange = (value: string) => {
        setContentPost(value);
    };

    const handleImageChange: UploadProps['onChange'] = ({ fileList }) => setImageList(fileList);
    const handleFileChange: UploadProps['onChange'] = ({ fileList }) => setFileList(fileList);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const mutationUpdate = useMutation({
        mutationFn: async (data: any) => {
            console.log("before", data, fileList, imageList)
            const url = URL_EDIT.replace(':controller', 'documents').replace(':id', documentId?.toString() || '')
            data.file_id = fileList[0]?.response?.data?.id ?? document?.data?.file_id
            data.image_id = imageList[0]?.response?.data?.id ?? document?.data?.image_id
            delete data.file
            delete data.image
            console.log("after", data)
            const res = await axios.put(url, data);
            return res.data;
        },
        onError: (error) => {
            console.log(error)
            setError(error.message)
        },
        onSuccess: () => {
            noti({
                message: 'Thành công',
                description: 'Cập nhật tài liệu thành công',
                type: 'success'
            })
            queryClient.invalidateQueries({ queryKey: ['documents'] })
            // router.push('/admin/documents')
        }
    })

    useEffect(() => {
        if (document?.data) {
            form.setFieldsValue({
                ...document.data,
                file: document.data?.file,
                image: document.data?.image,
                category_ids: (document.data as Document)?.categories?.map((category: Category) => category.id)
            })
        }
    }, [document, form])

    return (
        <div>
            <PageBreadcrumb pageTitle="Cập nhật tài liệu" />
            <ComponentCard title="Thông tin tài liệu">
                <Space direction='vertical' size={16}>
                    <Alert className='mb-4' message={'Tài liệu được duyệt ngày: ' + (document?.data?.publish_date ?? '')} type="info" />
                </Space>
                {error && <Alert className='mb-4' message={error} type="error" />}
                <Form form={form} layout="vertical" onFinish={mutationUpdate.mutate} initialValues={{
                    ...document?.data as any,
                    category_ids: (document?.data as Document)?.categories?.map((category: Category) => category.id)
                }}>
                    <Form.Item shouldUpdate>
                        {() => {
                            return <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>;
                        }}
                    </Form.Item>
                    <Form.Item
                        label={"Hình ảnh"}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                        rules={[{ required: true }]}
                        name="image"
                    >
                        <Upload
                            action={`/api/files`}
                            headers={{ Authorization: 'Bearer ' + localStorage.getItem('token') }}
                            data={{
                                folder: 'avatars'
                            }}
                            maxCount={1}
                            listType="picture-card"
                            // fileList={imageList}
                            onPreview={handlePreview}
                            onChange={handleImageChange}
                            beforeUpload={(file) => {
                                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                if (!isJpgOrPng) {
                                    // message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
                                    noti({
                                        message: "Lỗi!",
                                        type: "error",
                                        description: "Bạn chỉ có thể tải lên file JPG/PNG!"
                                    })
                                    return Upload.LIST_IGNORE;
                                }
                                return isJpgOrPng;
                            }}
                        >
                            {imageList.length >= 1 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 2 }}>Tải ảnh đại diện lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Tiêu đề" name="title"
                        rules={[{ required: true, message: 'Tiêu đề là bắt buộc' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Danh mục" name="category_ids"
                        rules={[{ required: true, message: 'Danh mục là bắt buộc' }]}
                    >
                        <Select
                            mode='multiple'
                            allowClear
                            showSearch
                            options={categories?.data?.map((category: any) => ({ label: category.name, value: category.id })) || []} />
                    </Form.Item>

                    <Form.Item label="Tác giả" name="author_id">
                        <Select options={users?.data?.map((user: any) => ({ label: user.name, value: user.id })) || []} disabled />
                    </Form.Item>

                    <Form.Item label="Người tải lên" name="uploaded_by_id"
                    >
                        <Select options={users?.data?.map((user: any) => ({ label: user.name, value: user.id })) || []} disabled />
                    </Form.Item>

                    <Form.Item
                        label={"Nội dung"}
                        name="content"
                        rules={[{ required: true, message: 'Nội dung là bắt buộc' }]}
                    >
                        <ReactQuill value={contentPost} style={editorStyle} modules={modules} formats={formats} onChange={handleChange} placeholder={"Nhập nội dung"} />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status" initialValue="pending">
                        <Select options={[
                            { label: 'Chờ duyệt', value: 'pending' },
                            { label: 'Đã duyệt', value: 'approved' },
                            { label: 'Từ chối', value: 'rejected' }
                        ]} />
                    </Form.Item>

                    <Form.Item
                        label={"Tài liệu"}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                        rules={[{ required: true }]}
                        name="file"
                    >
                        <Upload
                            action={`/api/files`}
                            headers={{ Authorization: 'Bearer ' + localStorage.getItem('token') }}
                            data={{
                                folder: 'documents'
                            }}
                            maxCount={1}
                            progress={{
                                strokeColor: {
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                },
                                strokeWidth: 3,
                                format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                            }}
                            // fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={(file) => {
                                const isFileAllowed = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                    || file.type === 'application/pdf'
                                    || file.type === 'text/plain'
                                    || file.type === 'application/vnd.ms-excel'
                                    || file.type === 'application/vnd.ms-powerpoint';
                                if (!isFileAllowed) {
                                    noti({
                                        message: "Lỗi!",
                                        type: "error",
                                        description: "Bạn chỉ có thể tải lên file docx/pdf/notepad/text/excel/powerpoint!"
                                    })
                                    return Upload.LIST_IGNORE;
                                }
                                return isFileAllowed;
                            }}
                        >
                            {fileList.length >= 1 ? null : (
                                <div>
                                    <Button icon={<UploadOutlined />}>Bấm để tải lên</Button>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Cập nhật tài liệu</Button>
                    </Form.Item>
                </Form>
            </ComponentCard>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </div>
    )
} 