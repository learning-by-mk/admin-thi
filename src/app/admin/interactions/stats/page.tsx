import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StatsContent from "./content";
// import StatsContent from "./content";

export const metadata: Metadata = {
    title: "Thống kê tương tác",
    description: "Thống kê các tương tác của người dùng",
};

export default function InteractionStatsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Thống kê tương tác" />
            <div className="space-y-6">
                <StatsContent />
            </div>
        </div>
    );
} 