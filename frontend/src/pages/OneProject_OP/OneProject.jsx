// frontend/src/pages/OneProject/OneProject.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConsultantCard from '../../components/ConsultantCard/ConsultantCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import './OneProject.css';

const parseBudget = (budgetValue) => {
  if (typeof budgetValue === 'number') return budgetValue;
  if (!budgetValue) return 0;

  const numStr = budgetValue.toString()
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = parseFloat(numStr);
  return isNaN(parsed) ? 0 : parsed;
};

const formatApiDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) return dateString;

  try {
    const parts = dateString.split('.');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  } catch (e) {
    console.warn("Date parsing failed:", e);
  }

  return new Date().toISOString().split('T')[0];
};

const OneProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConsultant, setNewConsultant] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const statusDropdownRef = useRef(null);

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (value) => {
    if (typeof value === 'string' && value.includes('€')) {
      return value;
    }

    const numericValue = typeof value === 'string'
      ? value.replace(/[^\d,]/g, '').replace(',', '.')
      : value;

    try {
      const number = parseFloat(numericValue);
      if (!isNaN(number)) {
        return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'EUR'
        }).format(number);
      }
    } catch (e) {
      console.error('Error formatting budget:', e);
    }

    return value;
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      if (id === 'new') {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002';
        const projectResponse = await axios.get(`${apiUrl}/project/${id}`);
        const loadedProject = projectResponse.data;

        // Client-Name laden
        let clientName = 'Unknown';
        if (loadedProject.customer_id) {
          try {
            const clientResponse = await axios.get(`${apiUrl}/client/${loadedProject.customer_id}`);
            clientName = clientResponse.data.name || `Client #${loadedProject.customer_id}`;
          } catch (err) {
            console.warn('Client info not found:', err.message);
          }
        }

        setProject({
          ...loadedProject,
          subtitle: loadedProject.customer_priorities || '',
          client: clientName,
          startDate: formatDate(loadedProject.start_date),
          endDate: formatDate(loadedProject.end_date),
          goals: loadedProject.requirements?.map(r => `${r.skill} (${r.recommendedSeniority}) x${r.amount}`) || []
        });

        const staffingResponse = await axios.get(`${apiUrl}/recommendation/getstaffing/${id}`);
        const staffingData = staffingResponse.data;

       const formattedConsultants = await Promise.all(
  staffingData.map(async (entry) => {
    try {
      const consultantResponse = await axios.get(`${apiUrl}/consultant/get/${entry.consultant_id}`);
      const data = consultantResponse.data;
return {
  id: data.id,
  name: data.name,
  role: entry.requirement_level || data.title || 'Consultant',
  experience: `${entry.score || 0}/10 MatchPoint`,
  skills: Array.isArray(data.technologies) ? data.technologies : [],
  profileImage: data.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  project_id: id // ← hier hinzufügen
};

    } catch (e) {
      console.warn(`Consultant #${entry.consultant_id} not found:`, e.message);
      return {
        id: entry.consultant_id,
        name: `Consultant #${entry.consultant_id}`,
        role: entry.requirement_level || 'Consultant',
        experience: `${entry.score || 0}/10 MatchPoint`,
        skills: Array.isArray(entry.requirement_skill) ? entry.requirement_skill : [],
        profileImage: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      };
    }
  })
);


        setConsultants(formattedConsultants);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error loading project or staffing data:', error);
        setError('API connection error. Showing demo data.');
        setProject(null);
        setConsultants([]);
        setLoading(false);
      }
    };

    fetchProjectData();

    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [id]);

  const handleSendToClient = () => {
    alert("Request was sent to consultant");
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

const handleAddConsultant = async (e) => {
    e.preventDefault();
    if (!newConsultant.trim()) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002';

      const payload = {
        project_id: parseInt(id),      // id kommt aus useParams()
        query: newConsultant.trim()    // Consultant-Name
      };

      const response = await fetch(`${apiUrl}/recommendation/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Suggestion creation failed");

      window.location.reload();
      setNewConsultant('');
    } catch (error) {
      console.error('Fehler beim Senden der Consultant-Anfrage:', error);
      alert('Fehler beim Senden. Bitte erneut versuchen.');
    }
  };

  const handleAcceptConsultant = (consultantId) => {
    alert(`Consultant ${consultantId} accepted`);
  };

  const handleRejectConsultant = (consultantId) => {
    alert(`Consultant ${consultantId} rejected`);
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

const handleCustomerClick = () => {
  navigate(`/customers/${project.customer_id}`);
};
  const handleStatusChange = async (newStatus) => {
    if (!project || project.status === newStatus || updatingStatus) return;
    setUpdatingStatus(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002';
      const updatedProject = {
        title: project.title || "",
        description: project.description || "",
        location: project.location || "",
        start_date: formatApiDate(project.start_date),
        end_date: formatApiDate(project.end_date),
        budget: parseBudget(project.budget),
        status: newStatus,
        customer_id: typeof project.customer_id === 'number' ? project.customer_id : 0,
        customer_priorities: project.customer_priorities || "",
        project_feedback_rating: null,
        project_feedback_comment: null,
        requirements: Array.isArray(project.requirements) ? project.requirements : []
      };

      console.log("Sending update with data:", updatedProject);
      await axios.put(`${apiUrl}/project/edit/${id}`, updatedProject);
      setProject({ ...project, status: newStatus });
      setStatusDropdownOpen(false);
    } catch (error) {
      console.error('Error updating project status:', error);
      alert('Failed to update project status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="error-container">
        <h2>Project not found</h2>
        <button onClick={handleBackToProjects}>Back to overview</button>
      </div>
    );
  }

  return (
    <div className="one-project-page">
      <div className="one-project-container">
        <div className="project-header-actions">
          <button className="back-button" onClick={handleBackToProjects}>
            ← Back to Overview
          </button>
          <div className="status-dropdown" ref={statusDropdownRef} tabIndex={0}>
            <div onClick={toggleStatusDropdown} className="clickable">
              <StatusBadge status={project.status} />
            </div>
            {statusDropdownOpen && (
              <div className="status-dropdown-content">
                {statusOptions.map(option => (
                  <div key={option.value} className={`status-option ${option.value}`} onClick={() => handleStatusChange(option.value)}>
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <h1 className="project-title">{project.title}</h1>
        <p className="project-subtitle">{project.subtitle}</p>

        <div className="project-details-card">
          <div className="project-info-section">
            <div className="client-budget-row">
              <div className="info-item">
                <span className="info-label">Client:</span>

                <span className="info-value clickable"  onClick={handleCustomerClick}>{project.client}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Budget:</span>
                <span className="info-value">{formatCurrency(project.budget)}</span>
              </div>
            </div>

            <div className="dates-row">
              <div className="info-item">
                <span className="info-label">Start:</span>
                <span className="info-value">{project.startDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">End:</span>
                <span className="info-value">{project.endDate}</span>
              </div>
            </div>
          </div>

          <div className="project-description-section">
            <h3>Project Description</h3>
            <p>{project.description}</p>
          </div>

          {project.goals && project.goals.length > 0 && (
            <div className="project-goals-section">
              <h3>Project Goals</h3>
              <ul>
                {project.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="consultants-section">
          <div className="consultants-header">
            <h2>Project Team</h2>
            <form className="add-consultant-form" onSubmit={handleAddConsultant}>
              <input
                type="text"
                placeholder="Enhance Staffing ...."
                value={newConsultant}
                onChange={(e) => setNewConsultant(e.target.value)}
                className="consultant-input"
              />
              <button 
                type="submit" 
                className="add-consultant-btn" 
                style={{ padding: '8px 15px', minWidth: '80px' }}
              >
                Add
              </button>
            </form>
          </div>

          <div className="consultants-grid">
            {consultants.length > 0 ? (
              consultants.map(consultant => (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  onAccept={() => handleAcceptConsultant(consultant.id)}
                  onReject={() => handleRejectConsultant(consultant.id)}
                  profileImage={consultant.profileImage}
                />
              ))
            ) : (
              <div className="no-consultants">
                No consultants assigned to this project.
              </div>
            )}
          </div>
        </div>

        <div className="project-actions">
          <button className="send-client-btn" onClick={handleSendToClient}>
            Request Consultants
          </button>
        </div>
      </div>
    </div>
  );
};

export default OneProject;

