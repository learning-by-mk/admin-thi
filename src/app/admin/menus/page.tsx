import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MenuContent from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Danh sách menu",
    description:
        "Đây là trang danh sách menu",
};

export default function MenusPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách menu" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách menu">
                    <MenuContent />
                </ComponentCard>
            </div>
        </div>
    );
}
