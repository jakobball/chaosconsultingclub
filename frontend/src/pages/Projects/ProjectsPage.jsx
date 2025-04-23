// frontend/src/pages/Projects/ProjectsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProjectsPage.css';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dummy-Projekt für Vorschau
  const dummyProjects = [
    {
      id: 'dummy-1',
      title: 'Webseiten-Optimierung für StartupX',
      subtitle: 'UX/UI Redesign für Startup im FinTech-Bereich',
      description: 'Ein junges FinTech-Startup benötigt Hilfe bei der Optimierung ihrer Webseite. Das Ziel ist es, die Conversion-Rate zu erhöhen und die Nutzererfahrung zu verbessern.',
      status: 'planned'
    },
    {
      id: 'dummy-2',
      title: 'KI-gestütztes Matching-System',
      subtitle: 'Automatisierung des Consultant-Matching-Prozesses',
      description: 'Entwicklung eines intelligenten Systems zur Optimierung der Berater-Projekt-Zuordnung durch maschinelles Lernen.',
      status: 'active'
    },
    {
      id: 'dummy-3',
      title: 'Digitale Marktanalyse',
      subtitle: 'Analyse des europäischen E-Commerce Marktes',
      description: 'Durchführung einer umfassenden Marktanalyse für einen E-Commerce-Anbieter mit Schwerpunkt auf Wachstumsmöglichkeiten in verschiedenen europäischen Ländern.',
      status: 'completed'
    }
  ];

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'planned', label: 'Planned' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002';
        console.log("API-Anfrage an:", `${apiUrl}/project/all`);
        const response = await axios.get(`${apiUrl}/project/all`);
        const projectsData = response.data;
        setProjects(projectsData);
        
        // Filtere Projekte nach Status, falls ein Filter ausgewählt ist
        if (selectedStatus) {
          setFilteredProjects(projectsData.filter(p => p.status === selectedStatus));
        } else {
          setFilteredProjects(projectsData);
        }
        
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Projekte:', error);
        setError('API-Verbindungsfehler. Zeige Demo-Daten.');
        // Bei Fehler: Dummy-Projekte anzeigen
        setProjects(dummyProjects);
        if (selectedStatus) {
          setFilteredProjects(dummyProjects.filter(p => p.status === selectedStatus));
        } else {
          setFilteredProjects(dummyProjects);
        }
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedStatus]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const viewProjectDetails = (id) => {
    navigate(`/project/${id}`);
  };
  
  const handleCreateProject = () => {
    navigate('/project/new');
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
              onClick={() => handleStatusFilter(option.value)}
              data-status={option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

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
                    </div>
                    <StatusBadge status={project.status} />
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

