/*
 * COMPONENTA NAVBAR
 * 
 * Bara de navigare din partea de sus a aplicatiei.
 * Arata:
 * - Logo-ul si numele aplicatiei
 * - Butoane pentru navigare (Toate Proiectele, Proiectele Mele)
 * - Info despre user-ul logat si buton de deconectare
 */

function Navbar({ user, onLogout, currentView, onNavigate }) {
    return (
        <nav className="navbar">
            {/* partea stanga - logo */}
            <div className="navbar-brand">
                <span className="navbar-icon">🐛</span>
                <span className="navbar-title">Bug Tracker</span>
            </div>

            {/* butoane de navigare */}
            <div className="navbar-menu">
                <button
                    className={`nav-link ${currentView === 'projects' ? 'active' : ''}`}
                    onClick={() => onNavigate('projects')}
                >
                    📂 Toate Proiectele
                </button>
                <button
                    className={`nav-link ${currentView === 'my-projects' ? 'active' : ''}`}
                    onClick={() => onNavigate('my-projects')}
                >
                    📁 Proiectele Mele
                </button>
            </div>

            {/* partea dreapta - info user si logout */}
            <div className="navbar-user">
                <div className="user-info">
                    <span className="user-avatar">👤</span>
                    <span className="user-name">{user.name}</span>
                </div>
                <button className="btn btn-outline btn-small" onClick={onLogout}>
                    Deconectare
                </button>
            </div>
        </nav>
    )
}

export default Navbar
