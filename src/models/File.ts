export default interface File {
    id: number;
    uuid: string;
    name: string;
    mime: string;
    disk: string;
    path: string;
    size: number;
    ext: string;
    user_id: number;
    hash: string;
    created_at: string;
    updated_at: string;
    url: string;
}
