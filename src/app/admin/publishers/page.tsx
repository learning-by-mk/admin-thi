import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PublisherContent from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Danh sách nhà xuất bản",
    description: "Đây là trang danh sách nhà xuất bản",
};

export default function PublishersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách nhà xuất bản" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách nhà xuất bản">
                    <PublisherContent />
                </ComponentCard>
            </div>
        </div>
    );
} 