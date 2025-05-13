export enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export default interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    slug: string;
    href: string;
    status: CategoryStatus;
    created_at: string;
    updated_at: string;
}
