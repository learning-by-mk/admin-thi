import * as LucideIcons from 'lucide-react';
const iconComponents = LucideIcons as unknown as Record<string, React.ComponentType<any>>;
export default iconComponents;

export const iconKeys = Object.keys(iconComponents);
