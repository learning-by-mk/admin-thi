import Role from './Role';

export default interface Permission {
    id: number;
    name: string;
    roles: Role[];
}
