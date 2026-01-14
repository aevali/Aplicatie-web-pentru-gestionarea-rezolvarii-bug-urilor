import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Componenta ProjectList - Afiseaza lista proiectelor
 * @param {object} user - Utilizatorul curent
 * @param {boolean} showOnlyMine - Daca afisam doar proiectele utilizatorului
 * @param {function} onSelectProject - Callback pentru selectarea unui proiect
 */
function ProjectList({ user, showOnlyMine, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', repository: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helper pentru a obtine header-ul de autentificare
  const getAuthHeaders = () => ({
    headers: { 'X-User-Id': user.id }
  });

  // Incarcam proiectele
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const url = showOnlyMine
        ? 'https://aplicatieweb-bcj6.onrender.com/my-projects'
        : 'https://aplicatieweb-bcj6.onrender.com/projects';

      const response = await axios.get(url, showOnlyMine ? getAuthHeaders() : {});
      setProjects(response.data);
    } catch (err) {
      console.error('Eroare la incarcarea proiectelor:', err);
      setError('Nu s-au putut încărca proiectele');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [showOnlyMine]);

  // Adaugam un proiect nou
  const handleAddProject = async (e) => {
    e.preventDefault();
    setError('');

    if (!newProject.name || !newProject.repository) {
      setError('Numele și repository-ul sunt obligatorii');
      return;
    }

    try {
      await axios.post('https://aplicatieweb-bcj6.onrender.com/projects', newProject, getAuthHeaders());
      setSuccess('Proiect creat cu succes!');
      setNewProject({ name: '', repository: '', description: '' });
      setShowAddForm(false);
      fetchProjects();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la crearea proiectului');
    }
  };

  // Join ca tester la un proiect
  const handleJoinProject = async (projectId) => {
    try {
      await axios.post(`https://aplicatieweb-bcj6.onrender.com/projects/${projectId}/join`, {}, getAuthHeaders());
      setSuccess('Te-ai alăturat proiectului ca Tester!');
      fetchProjects();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la alăturarea la proiect');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Obtinem rolul utilizatorului in proiect
  const getUserRole = (project) => {
    if (project.myRole) return project.myRole;

    const member = project.projectMembers?.find(m => m.userId === user.id);
    return member?.role || null;
  };

  // Obtinem numarul de membri
  const getMemberCount = (project) => {
    return project.projectMembers?.length || 0;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Se încarcă proiectele...</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
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

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Formular adaugare proiect */}
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

      {/* Lista proiecte */}
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
            const role = getUserRole(project);
            const memberCount = getMemberCount(project);

            return (
              <div key={project.id} className="card project-card">
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  {role && (
                    <span className={`badge badge-${role.toLowerCase()}`}>
                      {role === 'MP' ? '👨‍💻 Membru Proiect' : '🧪 Tester'}
                    </span>
                  )}
                </div>

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

                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}

                <div className="project-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => onSelectProject(project)}
                  >
                    🐛 Vezi Bug-uri
                  </button>

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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectList;