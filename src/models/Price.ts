import Document from './Document';

export default interface Price {
    id: number;
    document_id: number;
    document: Document;
    price: number; // Giá tiền (sẽ không còn sử dụng)
    points: number; // Số điểm cần thiết để tải tài liệu
    is_free: boolean;
    created_at: string;
    updated_at: string;
}
