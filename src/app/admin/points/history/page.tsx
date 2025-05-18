import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PointsHistoryContent from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Lịch sử giao dịch điểm",
    description: "Đây là trang lịch sử giao dịch điểm trong hệ thống",
};

export default function PointsHistoryPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Lịch sử giao dịch điểm" />
            <div className="space-y-6">
                <ComponentCard title="Lịch sử giao dịch điểm">
                    <PointsHistoryContent />
                </ComponentCard>
            </div>
        </div>
    );
} 