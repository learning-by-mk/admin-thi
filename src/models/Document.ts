import AiSummary from './AiSummary';
import AiVoice from './AiVoice';
import Category from './Category';
import ChatbotQuestion from './ChatbotQuestion';
import Comment from './Comment';
import Favorite from './Favorite';
import File from './File';
import Rating from './Rating';
import Topic from './Topic';
import User from './User';

export enum DocumentStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    DRAFT = 'draft',
}

export default interface Document {
    id: number;
    title: string;
    description: string;
    file_path: string;
    pdf_path: string;
    status: DocumentStatus;
    content: string;
    author_id: number;
    author: User;
    category: Category;
    topics: Topic[];
    comments: Comment[];
    ratings: Rating[];
    rating: number;
    review_count: number;
    favorites: Favorite[];
    ai_summaries: AiSummary[];
    ai_voices: AiVoice[];
    chatbot_questions: ChatbotQuestion[];
    uploaded_by_id: number;
    uploaded_by: User;
    created_at: string;
    updated_at: string;
    publish_date: string;
    image: File[];
    image_id: number;
    view_count: number;
    download_count: number;
    favorite_count: number;
    file: File[];
    file_id: number;
    like_count: number;
}
