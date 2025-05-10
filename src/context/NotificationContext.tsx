'use client'

import Notification from "@/app/notification";
import { store } from "@/redux-toolkit/store/store";
import { Provider } from "react-redux";

const NotificationProvider = ({ children }: {
    children: React.ReactNode
}) => {
    return <Provider store={store}>
        <Notification>
            {children}
        </Notification>
    </Provider>
}

export default NotificationProvider;
