import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AuthorContent from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Danh sách tác giả",
    description: "Đây là trang danh sách tác giả",
};

export default function AuthorsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách tác giả" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách tác giả">
                    <AuthorContent />
                </ComponentCard>
            </div>
        </div>
    );
} 