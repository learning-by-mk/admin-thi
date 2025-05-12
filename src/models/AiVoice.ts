import Document from './Document';

export default interface AiVoice {
    id: number;
    document_id: number;
    document: Document;
    audio_path: string;
    created_at: string;
    updated_at: string;
}
