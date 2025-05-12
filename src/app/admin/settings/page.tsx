import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import SettingsContent from "./content";

export const metadata: Metadata = {
    title: "Cài đặt",
    description:
        "Đây là trang cài đặt",
};

export default function SettingsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Cài đặt" />
            <div className="space-y-6">
                <ComponentCard title="Cài đặt">
                    <SettingsContent />
                </ComponentCard>
            </div>
        </div>
    );
}
