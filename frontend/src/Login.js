import React, { useState } from 'react';
import axios from 'axios';

/**
 * Componenta Login - Formular de autentificare
 */
function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('https://aplicatieweb-bcj6.onrender.com/auth/login', {
                email,
                password
            });

            // Salvam datele utilizatorului in localStorage
            localStorage.setItem('user', JSON.stringify(response.data));
            onLogin(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la autentificare');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">🐛</div>
                    <h1>Bug Tracker</h1>
                    <p>Conectează-te pentru a continua</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Se conectează...' : 'Conectare'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Nu ai cont?{' '}
                        <button
                            type="button"
                            className="link-button"
                            onClick={onSwitchToRegister}
                        >
                            Înregistrează-te
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
