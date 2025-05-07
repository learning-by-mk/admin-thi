import { TypeAPI, setNotification } from '@/redux-toolkit/slices/notificationSlice';
import { AppDispatch } from '@/redux-toolkit/store/store';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useNoti() {
    const dispatch = useDispatch<AppDispatch>();
    const noti = useCallback(
        ({ message, description, type }: { message: string; description: string; type?: TypeAPI }) => {
            dispatch(setNotification({ message, description, type: type ?? 'info' }));
            return 0;
        },
        [dispatch]
    );
    return { noti };
}
