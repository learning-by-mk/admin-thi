'use client'

import { setNotification } from '@/redux-toolkit/slices/notificationSlice';
import { AppDispatch, RootState, store } from '@/redux-toolkit/store/store';
import { notification } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import React, { useEffect, useMemo } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';

type TypeAPI = 'info' | 'success' | 'warning' | 'error' | 'open'


const Notification = ({ children }: {
    children: React.ReactNode
}) => {
    const { message, description, placement, type } = useSelector((state: RootState) => state.notification);
    const [api, contextHolder] = notification.useNotification();
    const dispatch = useDispatch<AppDispatch>()
    const openNotification = ({ message, description, placement = 'topRight', type = "info" }:
        { message: string, description: string, placement?: NotificationPlacement, type?: TypeAPI }) => {

        const apiType: TypeAPI = type.length !== 0 ? type : "info";
        const pla: NotificationPlacement = placement.length !== 0 ? placement : "topRight";

        api[apiType]({
            message,
            description,
            placement: pla,
        });
    }

    useEffect(() => {
        if (message.length !== 0) {
            openNotification({ message, description, placement, type });
            dispatch(setNotification({
                message: "",
                description: "",
            }))
        }
    }, [message])

    return (
        <React.Fragment>
            {contextHolder}
            {children}
        </React.Fragment>
    )
}

export default Notification;

