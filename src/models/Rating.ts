import Document from './Document';
import User from './User';

export default interface Rating {
    id: number;
    document_id: number;
    document: Document;
    user_id: number;
    user: User;
    score: number;
    comment: string;
    created_at: string;
    updated_at: string;
}
