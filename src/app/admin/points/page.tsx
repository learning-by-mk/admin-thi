import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PointsContent from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Thống kê điểm số",
    description: "Đây là trang thống kê điểm số trong hệ thống",
};

export default function PointsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Thống kê điểm số" />
            <div className="space-y-6">
                <ComponentCard title="Tổng quan về điểm số">
                    <PointsContent />
                </ComponentCard>
            </div>
        </div>
    );
} 