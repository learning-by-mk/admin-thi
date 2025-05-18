import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreatePublisherForm from "./form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Tạo mới nhà xuất bản",
    description: "Đây là trang tạo mới nhà xuất bản",
};

export default function CreatePublisherPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tạo mới nhà xuất bản" />
            <div className="space-y-6">
                <ComponentCard title="Tạo mới nhà xuất bản">
                    <CreatePublisherForm />
                </ComponentCard>
            </div>
        </div>
    );
} 