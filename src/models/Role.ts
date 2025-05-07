export default interface Role {
    id: number;
    name: string;
    title: string;
    guard_name: string;
    permission: Array<string>;
}

export interface RoleUpdate {
    name: string;
    title: string;
    guard_name: string;
    permission: Array<string>;
}

export interface RoleCreate {
    name: string;
    title: string;
    guard_name: string;
    permission: Array<string>;
}
