import { JSX } from 'react';
import Role from './Role';

export default interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    status: string;
    actions: JSX.Element;
    roles: Role[];
    permissions?: string[];
    email_verified_at: string;
}
