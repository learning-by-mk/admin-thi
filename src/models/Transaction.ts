import Document from './Document';
import User from './User';

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum TransactionPaymentMethod {
    STRIPE = 'stripe',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
}

export default interface Transaction {
    id: number;
    user_id: number;
    user: User;
    amount: number;
    status: TransactionStatus;
    payment_method: TransactionPaymentMethod;
    created_at: string;
    updated_at: string;
}
