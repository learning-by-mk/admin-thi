import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import CategoriesContent from "./content";

export const metadata: Metadata = {
    title: "Danh sách tài liệu",
    description:
        "Đây là trang danh sách tài liệu",
};

export default function CategoriesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách danh mục" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách danh mục">
                    <CategoriesContent />
                </ComponentCard>
            </div>
        </div>
    );
}
