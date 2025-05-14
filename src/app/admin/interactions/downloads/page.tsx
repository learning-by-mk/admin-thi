import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import DownloadsContent from "./content";

export const metadata: Metadata = {
    title: "Danh sách tải xuống",
    description: "Quản lý lượt tải xuống tài liệu của người dùng",
};

export default function DownloadsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách tải xuống" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách tải xuống">
                    <DownloadsContent />
                </ComponentCard>
            </div>
        </div>
    );
}