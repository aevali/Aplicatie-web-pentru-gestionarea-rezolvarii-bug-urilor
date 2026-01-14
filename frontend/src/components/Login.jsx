/*
 * COMPONENTA LOGIN
 * 
 * Formular simplu de logare.
 * User-ul introduce email si parola, noi le trimitem la backend.
 * Daca sunt corecte, salvam datele in localStorage si redirectam.
 */

import { useState } from 'react'
import axios from 'axios'

function Login({ onLogin, onSwitchToRegister }) {
    // starea pentru campurile formularului
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // mesajul de eroare (daca e cazul)
    const [error, setError] = useState('')

    // pentru a dezactiva butonul cat timp se trimite request-ul
    const [loading, setLoading] = useState(false)

    // handler pentru submit-ul formularului
    const handleSubmit = async (e) => {
        e.preventDefault()  // prevenim refresh-ul paginii
        setError('')
        setLoading(true)

        try {
            // trimitem datele la backend
            const response = await axios.post('http://localhost:8080/auth/login', {
                email,
                password
            })

            // daca a mers, salvam user-ul si anuntam componenta parinte
            localStorage.setItem('user', JSON.stringify(response.data))
            onLogin(response.data)
        } catch (err) {
            // daca a fost eroare, o afisam
            setError(err.response?.data?.message || 'Eroare la autentificare')
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
    )
}

export default Login
