import { useState, useCallback } from 'react';
import { useAuth } from './auth.hook';

export const useHttp = () => {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        if (body) {
            body = JSON.stringify(body);
            headers = {
                ...headers,
                'Content-Type': 'application/json'
            };
        }
        try {
            const response = await fetch(url, { method, body, headers });
            const data = await response.json();

            if (data.jwtError) {
                logout();
                return { jwtError: true };
            }

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }

            setLoading(false);

            return data;

        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearError = () => setError(null);

    return { loading, request, error, clearError };
}