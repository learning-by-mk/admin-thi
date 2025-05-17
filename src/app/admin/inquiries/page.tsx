import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import InquiriesContent from "./content";

export const metadata: Metadata = {
    title: "Danh sách đề xuất",
    description:
        "Đây là trang danh sách đề xuất",
};

export default function CategoriesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách đề xuất" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách đề xuất">
                    <InquiriesContent />
                </ComponentCard>
            </div>
        </div>
    );
}
