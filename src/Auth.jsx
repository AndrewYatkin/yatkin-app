import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) {
                throw error;
            }
            setMessage('Проверьте свою электронную почту для получения сслки для входа');
        } catch (error) {
            setError(error.message);
            console.error('Ошибка на входе', error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h2>Войти в аккаунт</h2>
            <p>Войдите по ссылке, направленной на вашу электронную почту</p>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ваш email"
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Отправка...':'Получить ссылку для входа'}
                </button>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">Ошибка: {error}</p>}
            </form>
        </div>
    );
}

export default Auth;