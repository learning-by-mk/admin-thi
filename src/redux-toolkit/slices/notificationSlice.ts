import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NotificationPlacement } from 'antd/es/notification/interface';

export type TypeAPI = 'info' | 'success' | 'warning' | 'error' | 'open';
interface valueSlice {
    message: string;
    description: string;
    placement?: NotificationPlacement;
    type?: TypeAPI;
}

const initialState: valueSlice = {
    message: '',
    description: '',
    placement: 'topRight',
    type: 'info',
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action: PayloadAction<valueSlice>) => {
            state.message = action.payload.message;
            state.description = action.payload.description;
            state.placement = action.payload.placement;
            state.type = action.payload.type;
        },
    },
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
