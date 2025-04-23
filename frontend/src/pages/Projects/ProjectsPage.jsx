import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dummy-Projekt für Vorschau
  const dummyProject = {
    id: 'dummy-1',
    title: 'Webseiten-Optimierung für StartupX',
    subtitle: 'UX/UI Redesign für Startup im FinTech-Bereich',
    description: 'Ein junges FinTech-Startup benötigt Hilfe bei der Optimierung ihrer Webseite. Das Ziel ist es, die Conversion-Rate zu erhöhen und die Nutzererfahrung zu verbessern. Wir suchen nach Studierenden mit Erfahrung in UX/UI Design und Webentwicklung.',
    status: 'open'
  };

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/projects${selectedStatus ? `?status=${selectedStatus}` : ''}`);
        setProjects(response.data.projects);
        setFilteredProjects(response.data.projects);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Projekte:', error);
        // Bei Fehler: Dummy-Projekt anzeigen
        setProjects([dummyProject]);
        setFilteredProjects([dummyProject]);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedStatus]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    // Wenn ein Filter gesetzt wird und wir das Dummy-Projekt zeigen, passen wir die Filterung an
    if (projects.length === 1 && projects[0].id === 'dummy-1') {
      if (status === '' || status === dummyProject.status) {
        setFilteredProjects([dummyProject]);
      } else {
        setFilteredProjects([]);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const viewProjectDetails = (id) => {
    navigate(`/project/${id}`);
  };
  
  const handleCreateProject = () => {
    console.log('Neues Projekt erstellen');
    // Hier könnte später eine Navigation oder ein Modal geöffnet werden
  };

  return (
    <div className="projects-page">
      <div className="projects-container">
        <div className="header-container">
          <h1>Chaos Consulting Club Projekte</h1>
          <button 
            className="create-project-btn"
            onClick={handleCreateProject}
          >
            Create Project
          </button>
        </div>
        
        <div className="filter-buttons">
          {statusOptions.map(option => (
            <button 
              key={option.value} 
              className={`filter-button ${selectedStatus === option.value ? 'active' : ''}`}
              data-status={option.value}
              onClick={() => handleStatusFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Projekte werden geladen...</div>
        ) : (
          <div className="projects-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div key={project.id} className="project-item">
                  <div className="project-content">
                    <div className="project-header">
                      <h2>{project.title}</h2>
                      <span className={`project-status ${getStatusClass(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    <h3>{project.subtitle}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-actions">
                      <button 
                        className="view-details" 
                        onClick={() => viewProjectDetails(project.id)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-projects">Keine Projekte gefunden.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

