import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { AUTH, GUEST } from '@/types/middleware';
import { useMutation, useQuery } from '@tanstack/react-query';
import User from '@/models/User';
import { ApiResponseDetail } from '@/types/Api';
import { URL_ME, URL_LOGIN, URL_LOGOUT } from '@/contains/api';
import { URL_WEB_LOGIN } from '@/contains/web';

type Middleware = typeof AUTH | typeof GUEST;

export const useAuth = ({ middleware, redirectIfAuthenticated }: { middleware?: Middleware; redirectIfAuthenticated?: string }) => {
    const router = useRouter();
    const params = useParams();
    const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null), []);
    const {
        data: user,
        error,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data } = await axios.get<User>(URL_ME, {
                params: {
                    include: 'roles,permissions',
                },
            });
            return data;
        },
        enabled: !!token,
    });

    const login = useMutation({
        mutationFn: async (props: any) => {
            const response = await axios.post(URL_LOGIN, props);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            refetch();
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const forgotPassword = async ({ setErrors, setStatus, email }: { setErrors: Function; setStatus: Function; email: string }) => {
        setErrors([]);
        setStatus(null);

        await axios
            .post('/forgot-password', { email })
            .then((response) => setStatus(response.data.status))
            .catch((error) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const resetPassword = async ({ setErrors, setStatus, ...props }: { setErrors: Function; setStatus: Function; password: string; password_confirmation: string }) => {
        setErrors([]);
        setStatus(null);

        await axios
            .post('/reset-password', { token: params.token, ...props })
            .then((response) => router.push('/login?reset=' + btoa(response.data.status)))
            .catch((error) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const resendEmailVerification = async ({ setStatus }: { setStatus: Function }) => {
        await axios.post('/email/verification-notification').then((response) => setStatus(response.data.status));
    };

    const logout = async () => {
        if (!error) {
            localStorage.removeItem('token');
            axios.post(URL_LOGOUT).then(() => refetch());
        }

        window.location.pathname = URL_WEB_LOGIN;
    };

    useEffect(() => {
        if (!user && !token) {
            router.push(URL_WEB_LOGIN);
        }
    }, [user, token]);

    useEffect(() => {
        if (middleware === GUEST && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated);
        if (window.location.pathname === '/verify-email' && user?.email_verified_at) router.push(redirectIfAuthenticated || '/');
        if (middleware === AUTH && !user && redirectIfAuthenticated) router.push(redirectIfAuthenticated);
        if (middleware === AUTH && !user?.isAdmin) router.push('/login');
    }, [user, error, isError]);

    return {
        user,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    };
};
