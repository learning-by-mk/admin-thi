import AiSummary from './AiSummary';
import AiVoice from './AiVoice';
import Category from './Category';
import ChatbotQuestion from './ChatbotQuestion';
import Comment from './Comment';
import Favorite from './Favorite';
import Rating from './Rating';
import User from './User';

export enum DocumentStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export default interface Document {
    id: number;
    title: string;
    description: string;
    file_path: string;
    pdf_path: string;
    status: DocumentStatus;
    author_id: number;
    author: User;
    categories: Category[];
    comments: Comment[];
    ratings: Rating[];
    favorites: Favorite[];
    ai_summaries: AiSummary[];
    ai_voices: AiVoice[];
    chatbot_questions: ChatbotQuestion[];
    uploaded_by_id: number;
    uploaded_by: User;
    created_at: string;
    updated_at: string;
    publish_date: string;
}
