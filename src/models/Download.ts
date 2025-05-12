import Document from './Document';
import User from './User';

export default interface Download {
    id: number;
    document_id: number;
    document: Document;
    user_id: number;
    user: User;
    created_at: string;
    updated_at: string;
}
