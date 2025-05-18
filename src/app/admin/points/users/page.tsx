import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PointsUsersContent from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Thống kê điểm theo người dùng",
    description: "Đây là trang thống kê điểm theo người dùng trong hệ thống",
};

export default function PointsUsersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Thống kê điểm theo người dùng" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách người dùng và điểm số">
                    <PointsUsersContent />
                </ComponentCard>
            </div>
        </div>
    );
} 