import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditAuthorForm from "./form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Chỉnh sửa tác giả",
    description: "Đây là trang chỉnh sửa tác giả",
};

interface EditAuthorPageProps {
    params: {
        id: string;
    }
}

export default function EditAuthorPage({ params }: EditAuthorPageProps) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Chỉnh sửa tác giả" />
            <div className="space-y-6">
                <ComponentCard title="Chỉnh sửa tác giả">
                    <EditAuthorForm id={params.id} />
                </ComponentCard>
            </div>
        </div>
    );
} 