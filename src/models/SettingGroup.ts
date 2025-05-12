import Setting from './Setting';

export default interface SettingGroup {
    id: number;
    name: string;
    description: string;
    settings: Setting[];
}
