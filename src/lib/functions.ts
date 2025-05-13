import { RcFile } from 'antd/es/upload/interface';

export const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (typeof document !== 'undefined') {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        } else {
            resolve('')
            // reject(new Error('Document is not defined'));
        }
    });
};
