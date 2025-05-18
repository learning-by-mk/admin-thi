import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateAuthorForm from "./form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Tạo mới tác giả",
    description: "Đây là trang tạo mới tác giả",
};

export default function CreateAuthorPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tạo mới tác giả" />
            <div className="space-y-6">
                <ComponentCard title="Tạo mới tác giả">
                    <CreateAuthorForm />
                </ComponentCard>
            </div>
        </div>
    );
} 