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
  
  // Dummy projects for preview
  const dummyProjects = [
    {
      id: 'dummy-1',
      title: 'Website Optimization for StartupX',
      subtitle: 'UX/UI Redesign for FinTech Startup',
      description: 'A young FinTech startup needs assistance with optimizing their website. The goal is to increase conversion rates and improve user experience.',
      status: 'planned'
    },
    {
      id: 'dummy-2',
      title: 'AI-Powered Matching System',
      subtitle: 'Automation of Consultant Matching Process',
      description: 'Development of an intelligent system to optimize consultant-project allocation through machine learning.',
      status: 'active'
    },
    {
      id: 'dummy-3',
      title: 'Digital Market Analysis',
      subtitle: 'Analysis of European E-Commerce Market',
      description: 'Conducting a comprehensive market analysis for an e-commerce provider with focus on growth opportunities in various European countries.',
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
    // Navigate directly to the upload project page
    navigate('/project/new');
  };

  return (
    <div className="projects-page">
      <div className="projects-container">
        <div className="header-container">
          <div className="logo-container">
            <h1 className="logo-text">
              <span className="logo-match">Match</span>
              <span className="logo-wise">wise</span>
            </h1>
          </div>
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
          <div className="loading">Loading projects...</div>
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
              <div className="no-projects">No projects found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

