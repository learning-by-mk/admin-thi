import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import FavoritesContent from "./content";

export const metadata: Metadata = {
    title: "Danh sách yêu thích",
    description: "Quản lý tài liệu yêu thích của người dùng",
};

export default function FavoritesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách yêu thích" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách yêu thích">
                    <FavoritesContent />
                </ComponentCard>
            </div>
        </div>
    );
}