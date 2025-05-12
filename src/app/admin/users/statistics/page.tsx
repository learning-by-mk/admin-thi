"use client";
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useState } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import ChartTab from '@/components/common/ChartTab'
import Badge from '@/components/ui/badge/Badge'
import { ArrowDownIcon, ArrowUpIcon, GroupIcon, BoxIconLine } from '@/icons'
import Image from 'next/image'

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
})

// Dữ liệu người dùng giả lập
const userData = {
    totalUsers: 3782,
    totalActiveUsers: 2945,
    newUsersThisMonth: 259,
    userGrowthRate: 11.01,
    activityStats: {
        daily: 1245,
        weekly: 2574,
        monthly: 3782,
        previousPeriodChange: -3.5
    },
    userDemographic: [
        { country: 'Việt Nam', users: 2379, percentage: 62 },
        { country: 'USA', users: 589, percentage: 16 },
        { country: 'China', users: 420, percentage: 11 },
        { country: 'Other', users: 394, percentage: 11 }
    ],
    userRegistration: [
        { month: 'Jan', users: 180 },
        { month: 'Feb', users: 190 },
        { month: 'Mar', users: 170 },
        { month: 'Apr', users: 160 },
        { month: 'May', users: 175 },
        { month: 'Jun', users: 165 },
        { month: 'Jul', users: 170 },
        { month: 'Aug', users: 205 },
        { month: 'Sep', users: 230 },
        { month: 'Oct', users: 210 },
        { month: 'Nov', users: 240 },
        { month: 'Dec', users: 235 }
    ],
    userActivity: [
        { month: 'Jan', activeUsers: 140 },
        { month: 'Feb', activeUsers: 150 },
        { month: 'Mar', activeUsers: 130 },
        { month: 'Apr', activeUsers: 120 },
        { month: 'May', activeUsers: 145 },
        { month: 'Jun', activeUsers: 135 },
        { month: 'Jul', activeUsers: 140 },
        { month: 'Aug', activeUsers: 175 },
        { month: 'Sep', activeUsers: 200 },
        { month: 'Oct', activeUsers: 185 },
        { month: 'Nov', activeUsers: 220 },
        { month: 'Dec', activeUsers: 210 }
    ],
    userDeviceUsage: {
        mobile: 65,
        desktop: 25,
        tablet: 10
    },
    userRoles: {
        admin: 25,
        moderator: 120,
        regular: 3637
    }
}

export default function StatisticsPage() {

    // Cấu hình biểu đồ đăng ký và hoạt động người dùng
    const userChartOptions: ApexOptions = {
        legend: {
            show: false,
        },
        colors: ['#465FFF', '#9CB9FF'],
        chart: {
            fontFamily: 'Outfit, sans-serif',
            height: 310,
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: 'straight',
            width: [2, 2],
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
        },
        xaxis: {
            type: 'category',
            categories: userData.userRegistration.map(item => item.month),
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    colors: ['#6B7280'],
                },
            },
            title: {
                text: '',
                style: {
                    fontSize: '0px',
                },
            },
        },
    }

    const userChartSeries = [
        {
            name: 'Người đăng ký mới',
            data: userData.userRegistration.map(item => item.users),
        },
        {
            name: 'Người dùng hoạt động',
            data: userData.userActivity.map(item => item.activeUsers),
        },
    ]

    // Cấu hình biểu đồ thiết bị sử dụng
    const deviceChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
        },
        colors: ['#465FFF', '#9CB9FF', '#D4DDFF'],
        labels: ['Di động', 'Máy tính', 'Máy tính bảng'],
        legend: {
            position: 'bottom',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                },
            },
        },
    }

    const deviceChartSeries = [
        userData.userDeviceUsage.mobile,
        userData.userDeviceUsage.desktop,
        userData.userDeviceUsage.tablet,
    ]

    return (
        <div>
            <PageBreadcrumb pageTitle="Thống kê người dùng" />

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 mb-6">
                {/* Tổng số người dùng */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                    </div>

                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Tổng người dùng
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                {userData.totalUsers}
                            </h4>
                        </div>
                        <Badge color="success">
                            <ArrowUpIcon />
                            {userData.userGrowthRate}%
                        </Badge>
                    </div>
                </div>

                {/* Người dùng mới */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <BoxIconLine className="text-gray-800 dark:text-white/90" />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Người dùng mới (tháng này)
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                {userData.newUsersThisMonth}
                            </h4>
                        </div>

                        <Badge color="error">
                            <ArrowDownIcon className="text-error-500" />
                            {userData.activityStats.previousPeriodChange}%
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Biểu đồ đăng ký và hoạt động người dùng */}
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 mb-6">
                <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Thống kê người dùng
                        </h3>
                        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                            Số lượng người đăng ký mới và người dùng hoạt động theo tháng
                        </p>
                    </div>
                    <div className="flex items-start w-full gap-3 sm:justify-end">
                        <ChartTab />
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px] xl:min-w-full">
                        <ReactApexChart
                            options={userChartOptions}
                            series={userChartSeries}
                            type="area"
                            height={310}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {/* Biểu đồ thiết bị */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
                        Thiết bị sử dụng
                    </h3>
                    <div className="h-[300px]">
                        <ReactApexChart
                            options={deviceChartOptions}
                            series={deviceChartSeries}
                            type="donut"
                            height={300}
                        />
                    </div>
                </div>

                {/* Thống kê theo quốc gia */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                        Người dùng theo quốc gia
                    </h3>
                    <p className="mb-6 text-gray-500 text-theme-sm dark:text-gray-400">
                        Số lượng người dùng theo quốc gia
                    </p>

                    <div className="space-y-5">
                        {userData.userDemographic.map((country, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                                            {country.country}
                                        </p>
                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                            {country.users} Người dùng
                                        </span>
                                    </div>
                                </div>

                                <div className="flex w-full max-w-[140px] items-center gap-3">
                                    <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                                        <div
                                            className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"
                                            style={{ width: `${country.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {country.percentage}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
