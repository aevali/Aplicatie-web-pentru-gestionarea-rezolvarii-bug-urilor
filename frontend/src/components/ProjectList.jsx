/*
 * COMPONENTA PROJECT LIST
 * 
 * Afiseaza lista de proiecte.
 * Poate arata fie toate proiectele, fie doar cele in care user-ul e membru.
 * 
 * Functionalitati:
 * - Vizualizare proiecte cu detalii (nume, repo, membri)
 * - Adaugare proiect nou (user-ul devine automat MP)
 * - Join la un proiect existent ca Tester
 */

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import API_URL from '../api'

function ProjectList({ user, showOnlyMine, onSelectProject }) {
  // lista de proiecte
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // pentru formularul de adaugare proiect
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', repository: '', description: '' })

  // mesaje pentru user
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // construim header-ul cu ID-ul user-ului pentru autentificare
  const getAuthHeaders = () => ({
    headers: { 'X-User-Id': user.id }
  })

  // functie pentru a incarca proiectele de la server
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      // daca showOnlyMine e true, luam doar proiectele user-ului
      const url = showOnlyMine
        ? `${API_URL}/my-projects`
        : `${API_URL}/projects`

      const headers = showOnlyMine ? { headers: { 'X-User-Id': user.id } } : {}
      const response = await axios.get(url, headers)
      setProjects(response.data)
    } catch (err) {
      console.error('Eroare la incarcarea proiectelor:', err)
      setError('Nu s-au putut încărca proiectele')
    } finally {
      setLoading(false)
    }
  }, [showOnlyMine, user.id])

  // incarcam proiectele la montarea componentei sau cand se schimba showOnlyMine
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // handler pentru adaugarea unui proiect nou
  const handleAddProject = async (e) => {
    e.preventDefault()
    setError('')

    if (!newProject.name || !newProject.repository) {
      setError('Numele și repository-ul sunt obligatorii')
      return
    }

    try {
      await axios.post(`${API_URL}/projects`, newProject, getAuthHeaders())
      setSuccess('Proiect creat cu succes!')
      setNewProject({ name: '', repository: '', description: '' })
      setShowAddForm(false)
      fetchProjects()  // reincarcam lista

      setTimeout(() => setSuccess(''), 3000)  // ascundem mesajul dupa 3 secunde
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la crearea proiectului')
    }
  }

  // handler pentru a te alatura unui proiect ca Tester
  const handleJoinProject = async (projectId) => {
    try {
      await axios.post(`${API_URL}/projects/${projectId}/join`, {}, getAuthHeaders())
      setSuccess('Te-ai alăturat proiectului ca Tester!')
      fetchProjects()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la alăturarea la proiect')
      setTimeout(() => setError(''), 3000)
    }
  }

  // functie helper: afla rolul user-ului intr-un proiect
  const getUserRole = (project) => {
    if (project.myRole) return project.myRole  // daca vine de la /my-projects

    // altfel, cautam in lista de membri
    const member = project.projectMembers?.find(m => m.userId === user.id)
    return member?.role || null
  }

  // functie helper: numara membrii unui proiect
  const getMemberCount = (project) => {
    return project.projectMembers?.length || 0
  }

  // afisam loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Se încarcă proiectele...</p>
      </div>
    )
  }

  return (
    <div className="projects-container">
      {/* header cu titlu si buton de adaugare */}
      <div className="page-header">
        <div className="header-content">
          <h1>{showOnlyMine ? '📁 Proiectele Mele' : '📂 Toate Proiectele'}</h1>
          <p className="subtitle">
            {showOnlyMine
              ? 'Proiectele în care ești membru (MP sau Tester)'
              : 'Lista tuturor proiectelor disponibile'}
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Anulează' : '+ Proiect Nou'}
        </button>
      </div>

      {/* mesaje de eroare/succes */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* formularul de adaugare proiect (vizibil doar cand showAddForm e true) */}
      {showAddForm && (
        <div className="card add-project-card">
          <h3>🆕 Adaugă Proiect Nou</h3>
          <p className="hint">Vei deveni automat Membru Proiect (MP)</p>

          <form onSubmit={handleAddProject}>
            <div className="form-row">
              <div className="form-group">
                <label>Nume Proiect *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Ex: Magazin Online"
                  required
                />
              </div>

              <div className="form-group">
                <label>Repository Git *</label>
                <input
                  type="text"
                  value={newProject.repository}
                  onChange={(e) => setNewProject({ ...newProject, repository: e.target.value })}
                  placeholder="Ex: https://github.com/user/repo"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descriere (opțional)</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Descriere scurtă a proiectului..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                💾 Salvează Proiect
              </button>
            </div>
          </form>
        </div>
      )}

      {/* lista de proiecte sau mesaj daca nu exista */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Nu ai niciun proiect</h3>
          <p>
            {showOnlyMine
              ? 'Nu ești membru în niciun proiect. Creează unul sau alătură-te la unul existent.'
              : 'Nu există proiecte încă. Fii primul care creează unul!'}
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => {
            const role = getUserRole(project)
            const memberCount = getMemberCount(project)

            return (
              <div key={project.id} className="card project-card">
                {/* header cu numele si badge-ul de rol */}
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  {role && (
                    <span className={`badge badge-${role.toLowerCase()}`}>
                      {role === 'MP' ? '👨‍💻 Membru Proiect' : '🧪 Tester'}
                    </span>
                  )}
                </div>

                {/* meta info: repo si numar de membri */}
                <div className="project-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📦</span>
                    <a href={project.repository} target="_blank" rel="noopener noreferrer" className="repo-link">
                      {project.repository}
                    </a>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <span>{memberCount} {memberCount === 1 ? 'membru' : 'membri'}</span>
                  </div>
                </div>

                {/* descrierea (daca exista) */}
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}

                {/* butoane de actiune */}
                <div className="project-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => onSelectProject(project)}
                  >
                    🐛 Vezi Bug-uri
                  </button>

                  {/* buton de join doar daca user-ul nu e deja membru */}
                  {!role && (
                    <button
                      className="btn btn-outline"
                      onClick={() => handleJoinProject(project.id)}
                    >
                      🧪 Alătură-te ca Tester
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProjectList