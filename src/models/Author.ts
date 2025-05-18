import User from './User';

export default interface Author {
    id: number;
    user_id: number;
    user?: User;
    biography: string;
    education: string;
    specialization: string;
    awards: string;
    total_documents: number;
    total_downloads: number;
    total_likes: number;
    created_at: string;
    updated_at: string;
}
