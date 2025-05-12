import ChatbotQuestion from './ChatbotQuestion';
import User from './User';

export interface Message {
    content: string;
    role: 'user' | 'assistant' | 'system';
}
export default interface Chat {
    id: number;
    uuid: string;
    user_id: number;
    user: User;
    chatbot_question_id: number;
    chatbot_question: ChatbotQuestion;
    title: string;
    last_message: string;
    messages: Message[];
    created_at: string;
    updated_at: string;
}
