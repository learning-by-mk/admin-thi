import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { AUTH, GUEST } from '@/types/middleware';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import User from '@/models/User';
import { ApiResponseDetail } from '@/types/Api';
import { URL_ME, URL_LOGIN, URL_LOGOUT, URL_REGISTER } from '@/contains/api';
import { URL_WEB_LOGIN } from '@/contains/web';
import useNoti from './useNoti';

type Middleware = typeof AUTH | typeof GUEST;

export const useAuth = ({ middleware, redirectIfAuthenticated }: { middleware?: Middleware; redirectIfAuthenticated?: string }) => {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const { noti } = useNoti();
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
                    load: 'roles,permissions',
                },
            });
            return data;
        },
    });

    const login = useMutation({
        mutationFn: async (props: any) => {
            const response = await axios.post(URL_LOGIN, props);
            return response.data;
        },
        // onSuccess: (data) => {
        //     console.log('data', data);
        //     if (data.is_admin) {
        //         localStorage.setItem('token', data.token);
        //         refetch();
        //     } else {
        //         noti({
        //             message: 'Bạn không có quyền truy cập vào trang này',
        //             description: 'Vui lòng liên hệ quản trị viên để được hỗ trợ',
        //             type: 'error',
        //         });
        //     }
        // },
    });

    const register = useMutation({
        mutationFn: async (props: any) => {
            const response = await axios.post(URL_REGISTER, props);
            return response.data;
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

    const logout = useMutation({
        mutationFn: async () => {
            const data = await axios.post(URL_LOGOUT);
            localStorage.removeItem('token');
            return data;
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.push(URL_WEB_LOGIN);
        },
    });

    // useEffect(() => {
    //     if (!user && !token) {
    //         router.push(URL_WEB_LOGIN);
    //     }
    // }, [user, token]);

    useEffect(() => {
        if (!user && !error) return;
        // Nếu đang ở trang GUEST (login/register) và đã đăng nhập (có user) và là admin
        // thì chuyển hướng đến trang được chỉ định
        if (middleware === GUEST && redirectIfAuthenticated && user && user.isAdmin) {
            router.push(redirectIfAuthenticated);
        }

        // Nếu đang ở trang Verify Email và đã xác thực email
        if (window.location.pathname === '/verify-email' && user?.email_verified_at) {
            router.push(redirectIfAuthenticated || '/');
        }

        // Nếu đang ở trang AUTH và chưa đăng nhập thì chuyển về login
        if (middleware === AUTH && !user && redirectIfAuthenticated) {
            router.push(redirectIfAuthenticated);
        }

        // Kiểm tra quyền admin CHỈ khi đang ở trang AUTH (không phải trang login/register)
        if (middleware === AUTH && user && !user.isAdmin) {
            // Xóa token và đăng xuất
            localStorage.removeItem('token');
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            logout.mutate();
            // Chuyển về trang login
            router.push(URL_WEB_LOGIN);
        }

        if (middleware === GUEST && user && !user.isAdmin) {
            localStorage.removeItem('token');
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            logout.mutate();
        }
    }, [user, error, isError, middleware, redirectIfAuthenticated, router]);

    return {
        user,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        register,
    };
};
