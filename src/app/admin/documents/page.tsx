import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import DocumentContent from "./content";

export const metadata: Metadata = {
    title: "Danh sách người dùng",
    description:
        "Đây là trang danh sách người dùng",
};

export default function UsersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách người dùng" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách người dùng">
                    <DocumentContent />
                </ComponentCard>
            </div>
        </div>
    );
}
