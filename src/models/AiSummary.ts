import Document from './Document';

export default interface AiSummary {
    id: number;
    document_id: number;
    document: Document;
    summary: string;
    created_at: string;
    updated_at: string;
}
