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
            setMessage('Проверьте свою электронную почту для получения ссылки для входа');
        } catch (error) {
            setError(error.message);
            console.error('Ошибка на входе', error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{
                textAlign: 'center',
                color: '#333',
                marginBottom: '10px'
            }}>Войти в аккаунт</h2>

            <p style={{
                textAlign: 'center',
                color: '#666',
                marginBottom: '20px',
                fontSize: '14px'
            }}>Войдите по ссылке, направленной на вашу электронную почту</p>

            <form onSubmit={handleLogin}>
                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="email" style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: '#333',
                        fontWeight: '500'
                    }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ваш email"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'background-color 0.3s'
                    }}
                >
                    {loading ? 'Отправка...' : 'Получить ссылку для входа'}
                </button>

                {message && (
                    <p style={{
                        color: '#28a745',
                        backgroundColor: '#d4edda',
                        padding: '10px',
                        borderRadius: '4px',
                        marginTop: '15px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {message}
                    </p>
                )}

                {error && (
                    <p style={{
                        color: '#dc3545',
                        backgroundColor: '#f8d7da',
                        padding: '10px',
                        borderRadius: '4px',
                        marginTop: '15px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        Ошибка: {error}
                    </p>
                )}
            </form>
        </div>
    );
}

export default Auth;