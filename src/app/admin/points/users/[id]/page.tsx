import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserPointsDetail from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Chi tiết điểm của người dùng",
    description: "Đây là trang chi tiết điểm của người dùng",
};

interface UserPointsPageProps {
    params: {
        id: string;
    }
}

export default function UserPointsPage({ params }: UserPointsPageProps) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Chi tiết điểm của người dùng" />
            <div className="space-y-6">
                <ComponentCard title="Thông tin điểm số">
                    <UserPointsDetail id={params.id} />
                </ComponentCard>
            </div>
        </div>
    );
} 