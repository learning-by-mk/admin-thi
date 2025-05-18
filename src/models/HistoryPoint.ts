import User from './User';

export default interface HistoryPoint {
    id: number;
    user_id: number;
    user: User;
    points: number; // Số điểm được cộng/trừ
    description: string; // Mô tả giao dịch
    created_at: string;
    updated_at: string;
}
