import Document from './Document';
import User from './User';

export enum PurchaseStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum PaymentMethod {
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
    BANK_TRANSFER = 'bank_transfer',
}

export default interface Purchase {
    id: number;
    document_id: number;
    document: Document;
    user_id: number;
    user: User;
    amount: number;
    status: PurchaseStatus;
    payment_method: PaymentMethod;
    transaction_id: string;
    payment_date: string;
    created_at: string;
    updated_at: string;
}
