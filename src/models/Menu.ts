export default interface Menu {
    id: string;
    name: string;
    slug: string;
    href: string;
    parent_id: string;
    parent: Menu;
    order: number;
    children: Menu[];
}
