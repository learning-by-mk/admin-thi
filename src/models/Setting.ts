import SettingGroup from './SettingGroup';

export default interface Setting {
    id: number;
    key: string;
    value: string;
    description: string;
    setting_group_id: number;
    setting_group: SettingGroup;
}
