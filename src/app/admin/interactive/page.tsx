import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import InteractiveContent from "./content";
export const metadata: Metadata = {
    title: "Danh sách tương tác",
    description:
        "Đây là trang danh sách tương tác",
};

export default function InteractivePage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách tương tác" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách tương tác">
                    <InteractiveContent />
                </ComponentCard>
            </div>
        </div>
    );
}
