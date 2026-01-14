/*
 * COMPONENTA REGISTER
 * 
 * Formular de inregistrare pentru useri noi.
 * Colecteaza: nume, email, parola, confirmare parola.
 * Face validari simple (parola minim 4 caractere, parolele sa coincida).
 */

import { useState } from 'react'
import axios from 'axios'

function Register({ onRegister, onSwitchToLogin }) {
    // starea pentru campurile formularului
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // validare: parolele trebuie sa coincida
        if (password !== confirmPassword) {
            setError('Parolele nu coincid')
            return
        }

        // validare: parola sa aiba minim 4 caractere
        if (password.length < 4) {
            setError('Parola trebuie să aibă minim 4 caractere')
            return
        }

        setLoading(true)

        try {
            // trimitem datele la backend
            const response = await axios.post('https://aplicatie-web-backend.onrender.com/auth/register', {
                name,
                email,
                password
            })

            // daca a mers, salvam si redirectam
            localStorage.setItem('user', JSON.stringify(response.data))
            onRegister(response.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la înregistrare')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">🐛</div>
                    <h1>Bug Tracker</h1>
                    <p>Creează un cont nou</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Nume complet</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ion Popescu"
                            required
                        />
                    </div>

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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmă parola</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Se creează contul...' : 'Înregistrare'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Ai deja cont?{' '}
                        <button
                            type="button"
                            className="link-button"
                            onClick={onSwitchToLogin}
                        >
                            Conectează-te
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
