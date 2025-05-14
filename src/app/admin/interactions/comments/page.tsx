import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import CommentsContent from "./content";

export const metadata: Metadata = {
    title: "Danh sách bình luận",
    description: "Quản lý bình luận của người dùng",
};

export default function CommentsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách bình luận" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách bình luận">
                    <CommentsContent />
                </ComponentCard>
            </div>
        </div>
    );
}