import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditPublisherForm from "./form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Chỉnh sửa nhà xuất bản",
    description: "Đây là trang chỉnh sửa nhà xuất bản",
};

interface EditPublisherPageProps {
    params: {
        id: string;
    }
}

export default function EditPublisherPage({ params }: EditPublisherPageProps) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Chỉnh sửa nhà xuất bản" />
            <div className="space-y-6">
                <ComponentCard title="Chỉnh sửa nhà xuất bản">
                    <EditPublisherForm id={params.id} />
                </ComponentCard>
            </div>
        </div>
    );
} 