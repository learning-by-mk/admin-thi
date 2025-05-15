import { InteractionStats } from '@/models/InteractionStats';

// Dữ liệu mẫu cho báo cáo thống kê tương tác
export const mockInteractionStats: InteractionStats = {
    summary: {
        ratings: {
            total: 396,
            average: 4.1,
            newCount: 28,
            growthRate: 12,
        },
        favorites: {
            total: 1410,
            newCount: 87,
            averagePerDocument: 4.8,
            growthRate: 15,
        },
        comments: {
            total: 2050,
            newCount: 124,
            averagePerDocument: 7.2,
            growthRate: 18,
        },
        downloads: {
            total: 4700,
            newCount: 320,
            averagePerDocument: 15.8,
            growthRate: 22,
        },
    },
    timeSeriesData: {
        ratings: {
            counts: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                values: [65, 59, 80, 81, 56, 55],
            },
            averageScores: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                values: [3.5, 4.1, 3.8, 4.2, 4.5, 4.3],
            },
        },
        favorites: {
            counts: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                values: [120, 190, 210, 250, 300, 340],
            },
        },
        comments: {
            counts: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                values: [250, 310, 290, 350, 400, 450],
            },
        },
        downloads: {
            counts: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                values: [500, 650, 700, 800, 950, 1100],
            },
        },
    },
    topDocuments: [
        {
            id: 1,
            title: 'Tài liệu A',
            interactionCount: 250,
            interactionTypes: {
                ratings: 45,
                favorites: 60,
                comments: 35,
                downloads: 110,
            },
        },
        {
            id: 2,
            title: 'Tài liệu B',
            interactionCount: 230,
            interactionTypes: {
                ratings: 38,
                favorites: 52,
                comments: 40,
                downloads: 100,
            },
        },
        {
            id: 3,
            title: 'Tài liệu C',
            interactionCount: 180,
            interactionTypes: {
                ratings: 30,
                favorites: 45,
                comments: 25,
                downloads: 80,
            },
        },
        {
            id: 4,
            title: 'Tài liệu D',
            interactionCount: 150,
            interactionTypes: {
                ratings: 25,
                favorites: 40,
                comments: 20,
                downloads: 65,
            },
        },
        {
            id: 5,
            title: 'Tài liệu E',
            interactionCount: 120,
            interactionTypes: {
                ratings: 20,
                favorites: 30,
                comments: 15,
                downloads: 55,
            },
        },
    ],
    interactionDistribution: {
        labels: ['Đánh giá', 'Yêu thích', 'Bình luận', 'Tải xuống'],
        values: [396, 1410, 2050, 4700],
    },
};

// Hàm giả lập lấy dữ liệu thống kê tương tác
export const getInteractionStats = async (timeRange: string = 'month', fromDate?: string, toDate?: string): Promise<InteractionStats> => {
    // Trong thực tế, bạn sẽ gọi API backend ở đây với các tham số
    // Ví dụ: return await axios.get('/api/interaction-stats', { params: { timeRange, fromDate, toDate } });

    // Trả về dữ liệu mẫu
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockInteractionStats);
        }, 500); // giả lập độ trễ mạng
    });
};

// Hàm giả lập lấy dữ liệu chi tiết cho một loại tương tác cụ thể
export const getInteractionTypeStats = async (type: 'ratings' | 'favorites' | 'comments' | 'downloads', timeRange: string = 'month'): Promise<any> => {
    // Trong thực tế, bạn sẽ gọi API backend ở đây với các tham số
    // Ví dụ: return await axios.get(`/api/interaction-stats/${type}`, { params: { timeRange } });

    // Trả về dữ liệu mẫu tương ứng với loại
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = {
                summary: mockInteractionStats.summary[type],
                timeSeriesData: mockInteractionStats.timeSeriesData[type],
                topDocuments: mockInteractionStats.topDocuments.slice(0, 5),
            };
            resolve(result);
        }, 500); // giả lập độ trễ mạng
    });
};

// Đề xuất cấu trúc API thực tế
/*
GET /api/stats/interactions
- Params: timeRange (week, month, quarter, year, custom), fromDate, toDate
- Response: InteractionStats (tổng quan về tất cả loại tương tác)

GET /api/stats/interactions/:type (ratings, favorites, comments, downloads)
- Params: timeRange (week, month, quarter, year, custom), fromDate, toDate
- Response: Chi tiết về loại tương tác cụ thể

GET /api/stats/interactions/top-documents
- Params: timeRange, limit (số lượng tài liệu muốn lấy)
- Response: Danh sách các tài liệu có nhiều tương tác nhất

GET /api/stats/interactions/by-document/:documentId
- Params: timeRange, fromDate, toDate
- Response: Thống kê tương tác cho một tài liệu cụ thể
*/
