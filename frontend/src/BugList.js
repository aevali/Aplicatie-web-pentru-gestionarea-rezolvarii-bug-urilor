import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Componenta BugList - Afiseaza si gestioneaza bug-urile unui proiect
 * @param {object} project - Proiectul curent
 * @param {object} user - Utilizatorul curent
 * @param {function} onBack - Callback pentru a reveni la lista de proiecte
 */
function BugList({ project, user, onBack }) {
  const [bugs, setBugs] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResolveForm, setShowResolveForm] = useState(null);
  const [newBug, setNewBug] = useState({
    description: '',
    severity: 'Medium',
    priority: 'Normal',
    commitLink: ''
  });
  const [resolveCommitLink, setResolveCommitLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'open', 'in_progress', 'resolved'

  // Header pentru autentificare
  const getAuthHeaders = () => ({
    headers: { 'X-User-Id': user.id }
  });

  // Obtinem rolul utilizatorului in proiect
  const getUserRole = () => {
    if (project.myRole) return project.myRole;
    const member = project.projectMembers?.find(m => m.userId === user.id);
    return member?.role || null;
  };

  const userRole = getUserRole();
  const isMP = userRole === 'MP';
  const isMember = userRole !== null;

  // Incarcam bug-urile
  const fetchBugs = async () => {
    try {
      const response = await axios.get(`https://aplicatieweb-bcj6.onrender.com/projects/${project.id}/bugs`);
      setBugs(response.data);
    } catch (err) {
      console.error('Eroare la incarcarea bug-urilor:', err);
      setError('Nu s-au putut încărca bug-urile');
    }
  };

  // Incarcam membrii proiectului
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`https://aplicatieweb-bcj6.onrender.com/projects/${project.id}/members`);
      setMembers(response.data);
    } catch (err) {
      console.error('Eroare la incarcarea membrilor:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBugs(), fetchMembers()]);
      setLoading(false);
    };
    loadData();
  }, [project.id]);

  // Adaugam un bug nou
  const handleAddBug = async (e) => {
    e.preventDefault();
    setError('');

    if (!newBug.description) {
      setError('Descrierea bug-ului este obligatorie');
      return;
    }

    try {
      await axios.post(
        `https://aplicatieweb-bcj6.onrender.com/projects/${project.id}/bugs`,
        newBug,
        getAuthHeaders()
      );

      setSuccess('Bug raportat cu succes!');
      setNewBug({ description: '', severity: 'Medium', priority: 'Normal', commitLink: '' });
      setShowAddForm(false);
      fetchBugs();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la raportarea bug-ului');
    }
  };

  // Alocam un bug
  const handleAssignBug = async (bugId) => {
    try {
      await axios.put(`https://aplicatieweb-bcj6.onrender.com/bugs/${bugId}/assign`, {}, getAuthHeaders());
      setSuccess('Bug-ul a fost alocat!');
      fetchBugs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la alocarea bug-ului');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Renuntam la un bug
  const handleUnassignBug = async (bugId) => {
    try {
      await axios.put(`https://aplicatieweb-bcj6.onrender.com/bugs/${bugId}/unassign`, {}, getAuthHeaders());
      setSuccess('Ai renunțat la bug');
      fetchBugs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Rezolvam un bug
  const handleResolveBug = async (bugId) => {
    try {
      await axios.put(
        `https://aplicatieweb-bcj6.onrender.com/bugs/${bugId}/resolve`,
        { resolvedCommitLink: resolveCommitLink },
        getAuthHeaders()
      );

      setSuccess('Bug rezolvat cu succes!');
      setShowResolveForm(null);
      setResolveCommitLink('');
      fetchBugs();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la rezolvarea bug-ului');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filtram bug-urile
  const filteredBugs = bugs.filter(bug => {
    if (filter === 'all') return true;
    return bug.status.toLowerCase() === filter.toLowerCase();
  });

  // Statistici
  const stats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'OPEN').length,
    inProgress: bugs.filter(b => b.status === 'IN_PROGRESS').length,
    resolved: bugs.filter(b => b.status === 'RESOLVED').length
  };

  // Obtinem culoarea statusului
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'IN_PROGRESS': return 'status-progress';
      case 'RESOLVED': return 'status-resolved';
      default: return '';
    }
  };

  // Obtinem culoarea severitatii
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'severity-high';
      case 'Medium': return 'severity-medium';
      case 'Low': return 'severity-low';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Se încarcă bug-urile...</p>
      </div>
    );
  }

  return (
    <div className="bugs-container">
      {/* Header cu info proiect */}
      <div className="page-header bugs-header">
        <button className="btn btn-outline back-btn" onClick={onBack}>
          ← Înapoi la Proiecte
        </button>

        <div className="header-content">
          <h1>🐛 {project.name}</h1>
          <div className="project-info">
            <span className="info-item">
              📦 <a href={project.repository} target="_blank" rel="noopener noreferrer">
                {project.repository}
              </a>
            </span>
            {userRole && (
              <span className={`badge badge-${userRole.toLowerCase()}`}>
                {userRole === 'MP' ? '👨‍💻 Membru Proiect' : '🧪 Tester'}
              </span>
            )}
          </div>
        </div>

        {isMember && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Anulează' : '+ Raportează Bug'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Statistici */}
      <div className="stats-row">
        <div className="stat-card" onClick={() => setFilter('all')}>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card stat-open" onClick={() => setFilter('open')}>
          <div className="stat-number">{stats.open}</div>
          <div className="stat-label">Deschise</div>
        </div>
        <div className="stat-card stat-progress" onClick={() => setFilter('in_progress')}>
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">În Progres</div>
        </div>
        <div className="stat-card stat-resolved" onClick={() => setFilter('resolved')}>
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Rezolvate</div>
        </div>
      </div>

      {/* Formular adaugare bug */}
      {showAddForm && (
        <div className="card add-bug-card">
          <h3>🆕 Raportează Bug Nou</h3>

          <form onSubmit={handleAddBug}>
            <div className="form-group">
              <label>Descriere *</label>
              <textarea
                value={newBug.description}
                onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
                placeholder="Descrieți problema în detaliu..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Severitate</label>
                <select
                  value={newBug.severity}
                  onChange={(e) => setNewBug({ ...newBug, severity: e.target.value })}
                >
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>

              <div className="form-group">
                <label>Prioritate</label>
                <select
                  value={newBug.priority}
                  onChange={(e) => setNewBug({ ...newBug, priority: e.target.value })}
                >
                  <option value="Urgent">⚡ Urgent</option>
                  <option value="Normal">📌 Normal</option>
                  <option value="Low">📎 Low</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Link Commit (opțional)</label>
              <input
                type="text"
                value={newBug.commitLink}
                onChange={(e) => setNewBug({ ...newBug, commitLink: e.target.value })}
                placeholder="https://github.com/user/repo/commit/..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                🐛 Raportează Bug
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtru activ */}
      {filter !== 'all' && (
        <div className="active-filter">
          <span>Filtru activ: <strong>{filter.replace('_', ' ').toUpperCase()}</strong></span>
          <button className="btn btn-small btn-outline" onClick={() => setFilter('all')}>
            ✕ Șterge filtru
          </button>
        </div>
      )}

      {/* Lista bug-uri */}
      {filteredBugs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <h3>{filter === 'all' ? 'Nu există bug-uri' : 'Niciun bug în această categorie'}</h3>
          <p>
            {filter === 'all'
              ? 'Proiectul nu are bug-uri raportate încă.'
              : 'Încearcă să schimbi filtrul.'}
          </p>
        </div>
      ) : (
        <div className="bugs-list">
          {filteredBugs.map((bug) => {
            const isAssignedToMe = bug.assignedToId === user.id;
            const canAssign = isMP && !bug.assignedToId && bug.status !== 'RESOLVED';
            const canUnassign = isAssignedToMe && bug.status !== 'RESOLVED';
            const canResolve = isAssignedToMe && bug.status === 'IN_PROGRESS';

            return (
              <div key={bug.id} className={`card bug-card ${getStatusColor(bug.status)}`}>
                <div className="bug-header">
                  <div className="bug-badges">
                    <span className={`badge ${getSeverityColor(bug.severity)}`}>
                      {bug.severity === 'High' ? '🔴' : bug.severity === 'Medium' ? '🟡' : '🟢'} {bug.severity}
                    </span>
                    <span className="badge badge-priority">
                      {bug.priority === 'Urgent' ? '⚡' : bug.priority === 'Normal' ? '📌' : '📎'} {bug.priority}
                    </span>
                    <span className={`badge ${getStatusColor(bug.status)}`}>
                      {bug.status === 'OPEN' ? '🔓' : bug.status === 'IN_PROGRESS' ? '🔄' : '✅'} {bug.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="bug-id">#{bug.id}</span>
                </div>

                <p className="bug-description">{bug.description}</p>

                <div className="bug-meta">
                  {bug.reporter && (
                    <span className="meta-item">
                      👤 Raportat de: <strong>{bug.reporter.name}</strong>
                    </span>
                  )}
                  {bug.assignedTo && (
                    <span className="meta-item">
                      🔧 Alocat lui: <strong>{bug.assignedTo.name}</strong>
                      {isAssignedToMe && <span className="you-badge">(tu)</span>}
                    </span>
                  )}
                  {bug.commitLink && (
                    <span className="meta-item">
                      🔗 <a href={bug.commitLink} target="_blank" rel="noopener noreferrer">
                        Commit bug
                      </a>
                    </span>
                  )}
                  {bug.resolvedCommitLink && (
                    <span className="meta-item">
                      ✅ <a href={bug.resolvedCommitLink} target="_blank" rel="noopener noreferrer">
                        Commit rezolvare
                      </a>
                    </span>
                  )}
                </div>

                {/* Formular rezolvare */}
                {showResolveForm === bug.id && (
                  <div className="resolve-form">
                    <div className="form-group">
                      <label>Link la commit-ul de rezolvare (opțional)</label>
                      <input
                        type="text"
                        value={resolveCommitLink}
                        onChange={(e) => setResolveCommitLink(e.target.value)}
                        placeholder="https://github.com/user/repo/commit/..."
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        className="btn btn-success"
                        onClick={() => handleResolveBug(bug.id)}
                      >
                        ✅ Confirmă Rezolvare
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setShowResolveForm(null);
                          setResolveCommitLink('');
                        }}
                      >
                        Anulează
                      </button>
                    </div>
                  </div>
                )}

                {/* Actiuni */}
                {(canAssign || canUnassign || canResolve) && showResolveForm !== bug.id && (
                  <div className="bug-actions">
                    {canAssign && (
                      <button
                        className="btn btn-outline"
                        onClick={() => handleAssignBug(bug.id)}
                      >
                        🙋 Alocă-mi acest bug
                      </button>
                    )}
                    {canUnassign && (
                      <button
                        className="btn btn-outline"
                        onClick={() => handleUnassignBug(bug.id)}
                      >
                        ↩️ Renunță
                      </button>
                    )}
                    {canResolve && (
                      <button
                        className="btn btn-success"
                        onClick={() => setShowResolveForm(bug.id)}
                      >
                        ✅ Marchează Rezolvat
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Membrii echipei */}
      <div className="team-section">
        <h3>👥 Echipa Proiectului</h3>
        <div className="team-list">
          {members.map((member) => (
            <div key={member.id} className="team-member">
              <span className="member-avatar">👤</span>
              <div className="member-info">
                <span className="member-name">{member.user.name}</span>
                <span className={`badge badge-${member.role.toLowerCase()}-small`}>
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BugList;