import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import RatingsContent from "./content";

export const metadata: Metadata = {
    title: "Danh sách đánh giá",
    description: "Quản lý đánh giá của người dùng",
};

export default function RatingsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách đánh giá" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách đánh giá">
                    <RatingsContent />
                </ComponentCard>
            </div>
        </div>
    );
}