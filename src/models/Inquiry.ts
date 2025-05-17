import User from './User';

export enum InquiryTopic {
    GENERAL = 'general',
    TECHNICAL = 'technical',
    CONTENT = 'content',
    PARTNERSHIP = 'partnership',
    OTHER = 'other',
}

export enum InquiryStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    REJECTED = 'rejected',
}

export default interface Inquiry {
    id: number;
    user_id: number;
    user: User;
    topic: InquiryTopic;
    name: string;
    email: string;
    phone: string;
    message: string;
    admin_response: string;
    status: InquiryStatus;
    response_at: string;
    created_at: string;
    updated_at: string;
}
