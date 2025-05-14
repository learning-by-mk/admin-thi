import Document from './Document';
import User from './User';

export default interface Comment {
    id: number;
    document_id: number;
    document: Document;
    user_id: number;
    user: User;
    comment: string;
    score: number;
    created_at: string;
    updated_at: string;
}
