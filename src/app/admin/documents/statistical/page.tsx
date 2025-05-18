import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PointsDocumentsContent from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Thống kê điểm theo tài liệu",
    description: "Đây là trang thống kê điểm theo tài liệu trong hệ thống",
};

export default function PointsDocumentsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Thống kê điểm theo tài liệu" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách tài liệu và điểm số">
                    <PointsDocumentsContent />
                </ComponentCard>
            </div>
        </div>
    );
} 