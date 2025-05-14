"use client";
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useMemo, useState } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import ChartTab from '@/components/common/ChartTab'
import Badge from '@/components/ui/badge/Badge'
import { ArrowDownIcon, ArrowUpIcon, GroupIcon, BoxIconLine } from '@/icons'
import Image from 'next/image'
import { showByUrl } from '@/apis/custom_fetch';

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
})

const Mount: Record<number, string> = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
}

export default function StatisticsPage() {
    const { data: userStatistics } = showByUrl<any>(`/api/users/statistics/show`)

    useEffect(() => {
        // if (userStatistics) {
        //     setUserData(userStatistics)
        // }
        console.log(userStatistics)
    }, [userStatistics])
    // Cấu hình biểu đồ đăng ký và hoạt động người dùng
    const userChartOptions: ApexOptions = useMemo(() => ({
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
            categories: Object.values(Mount)?.map((item: string) => item),
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
    }), [userStatistics, Mount])

    const userChartSeries = useMemo(() => ([
        {
            name: 'Người đăng ký mới',
            data: userStatistics?.data?.userRegistration?.map((item: any) => item.users),
        },
        {
            name: 'Người dùng hoạt động',
            data: userStatistics?.data?.userActivity?.map((item: any) => item.activeUsers),
        },
    ]), [userStatistics])

    useEffect(() => {
        console.log('userChartOptions', userChartOptions, Object.values(Mount)?.map((item: string) => item))
    }, [userChartOptions])

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
                                {userStatistics?.data?.totalUsers}
                            </h4>
                        </div>
                        <Badge color="success">
                            <ArrowUpIcon />
                            {userStatistics?.data?.userGrowthRate}%
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
                                {userStatistics?.data?.newUsersThisMonth}
                            </h4>
                        </div>

                        <Badge color="error">
                            <ArrowDownIcon className="text-error-500" />
                            {userStatistics?.data?.activityStats.previousPeriodChange}%
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
                {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
                        Thiết bị sử dụng
                    </h3>
                    <div className="h-[300px]">
                        <ReactApexChart
                            options={deviceChartOptions}
                            // series={deviceChartSeries}
                            type="donut"
                            height={300}
                        />
                    </div>
                </div> */}

                {/* Thống kê theo quốc gia */}
                {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                        Người dùng theo quốc gia
                    </h3>
                    <p className="mb-6 text-gray-500 text-theme-sm dark:text-gray-400">
                        Số lượng người dùng theo quốc gia
                    </p>

                    <div className="space-y-5">
                        {userStatistics?.data?.userDemographic?.map((country: any, index: number) => (
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
                </div> */}
            </div>
        </div>
    )
}
