/*
 * COMPONENTA APP
 * 
 * Aceasta e componenta principala a aplicatiei.
 * Se ocupa de:
 * - Verificarea daca user-ul e logat (din localStorage)
 * - Afisarea Login/Register daca nu e logat
 * - Afisarea aplicatiei principale daca e logat
 * - Navigarea intre pagini (proiecte, bug-uri)
 */

import { useState, useEffect } from 'react'
import Login from './Login'
import Register from './Register'
import Navbar from './Navbar'
import ProjectList from './ProjectList'
import BugList from './BugList'
import '../App.css'

function App() {
  // starea pentru user-ul curent (null daca nu e logat)
  const [user, setUser] = useState(null)

  // ce afisam in zona de autentificare: 'login' sau 'register'
  const [authView, setAuthView] = useState('login')

  // ce pagina afisam: 'projects', 'my-projects', sau 'bugs'
  const [currentView, setCurrentView] = useState('projects')

  // proiectul selectat (cand vrem sa vedem bug-urile lui)
  const [selectedProject, setSelectedProject] = useState(null)

  // aratam un loading pana verificam localStorage
  const [loading, setLoading] = useState(true)

  /*
   * La incarcarea aplicatiei, verificam daca avem un user salvat.
   * Daca da, il incarcam si user-ul ramane logat.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        // daca e ceva stricat in localStorage, il curatam
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // handler pentru cand user-ul se logheaza sau inregistreaza
  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('projects')
  }

  // handler pentru logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setAuthView('login')
    setSelectedProject(null)
  }

  // cand user-ul selecteaza un proiect pentru a vedea bug-urile
  const handleSelectProject = (project) => {
    setSelectedProject(project)
    setCurrentView('bugs')
  }

  // cand user-ul vrea sa se intoarca la lista de proiecte
  const handleBackToProjects = () => {
    setSelectedProject(null)
    setCurrentView('projects')
  }

  // navigare intre sectiuni (din navbar)
  const handleNavigate = (view) => {
    setCurrentView(view)
    if (view !== 'bugs') {
      setSelectedProject(null)
    }
  }

  // afisam loading pana verificam localStorage
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Se încarcă...</p>
      </div>
    )
  }

  // daca user-ul nu e logat, afisam formularele de autentificare
  if (!user) {
    if (authView === 'register') {
      return (
        <Register
          onRegister={handleLogin}
          onSwitchToLogin={() => setAuthView('login')}
        />
      )
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView('register')}
      />
    )
  }

  // user-ul e logat - afisam aplicatia
  return (
    <div className="app">
      <Navbar
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <main className="main-content">
        {currentView === 'bugs' && selectedProject ? (
          <BugList
            project={selectedProject}
            user={user}
            onBack={handleBackToProjects}
          />
        ) : (
          <ProjectList
            user={user}
            showOnlyMine={currentView === 'my-projects'}
            onSelectProject={handleSelectProject}
          />
        )}
      </main>

      <footer className="footer">
        <p>Bug Tracker © 2026 - Proiect WebTech</p>
      </footer>
    </div>
  )
}

export default App