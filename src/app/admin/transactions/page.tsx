import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransactionContent from "./content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Danh sách giao dịch",
    description:
        "Đây là trang danh sách giao dịch",
};

export default function TransactionsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách giao dịch" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách giao dịch">
                    <TransactionContent />
                </ComponentCard>
            </div>
        </div>
    );
}
