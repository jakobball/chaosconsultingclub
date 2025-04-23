// frontend/src/pages/OneProject/OneProject.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConsultantCard from '../../components/ConsultantCard/ConsultantCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import './OneProject.css';

const OneProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beispiel-Projektdaten falls keine Verbindung zur API besteht
  const dummyProjects = {
    'dummy-1': {
      id: 'dummy-1',
      title: 'Webseiten-Optimierung für StartupX',
      subtitle: 'UX/UI Redesign für Startup im FinTech-Bereich',
      status: 'open',
      description: 'Ein junges FinTech-Startup benötigt Hilfe bei der Optimierung ihrer Webseite. Das Ziel ist es, die Conversion-Rate zu erhöhen und die Nutzererfahrung zu verbessern. Wir suchen nach Studierenden mit Erfahrung in UX/UI Design und Webentwicklung.',
      client: 'FinTech GmbH',
      timeline: '6 Wochen',
      budget: '15.000 €',
      startDate: '15.09.2023',
      endDate: '30.10.2023',
      goals: [
        'Erhöhung der Conversion-Rate um 30%',
        'Verbesserung der Nutzererfahrung',
        'Optimierung der mobilen Ansicht'
      ]
    },
    'dummy-2': {
      id: 'dummy-2',
      title: 'KI-gestütztes Matching-System',
      subtitle: 'Automatisierung des Consultant-Matching-Prozesses',
      status: 'in_progress',
      description: 'Entwicklung eines intelligenten Systems, das Consultants basierend auf ihren Fähigkeiten, Erfahrungen und Verfügbarkeit optimal mit Kundenprojekten matcht.',
      client: 'TechVision GmbH',
      timeline: '3 Monate',
      budget: '85.000 €',
      startDate: '01.06.2023',
      endDate: '31.08.2023',
      goals: [
        'Entwicklung eines Algorithmus für optimales Consultant-Matching',
        'Integrierte Analyse von Fähigkeiten und Projekterfahrungen',
        'Implementierung einer benutzerfreundlichen Dashboard-Oberfläche',
        'Automatisierte Empfehlungen für Projektteams'
      ]
    },
    'dummy-3': {
      id: 'dummy-3',
      title: 'Digitale Marktanalyse',
      subtitle: 'Analyse des europäischen E-Commerce Marktes',
      status: 'completed',
      description: 'Durchführung einer umfassenden Marktanalyse für einen E-Commerce-Anbieter mit Schwerpunkt auf Wachstumsmöglichkeiten in verschiedenen europäischen Ländern.',
      client: 'Euro Shop AG',
      timeline: '2 Monate',
      budget: '40.000 €',
      startDate: '15.03.2023',
      endDate: '15.05.2023',
      goals: [
        'Identifikation von Wachstumsmärkten in Europa',
        'Analyse von Wettbewerbern und Marktanteilen',
        'Entwicklung von Handlungsempfehlungen'
      ]
    }
  };

  // Beispiel-Consultants für jedes Projekt
  const dummyConsultantsByProject = {
    'dummy-1': [
      {
        id: "c1",
        name: "Emma Schneider",
        role: "UX/UI Designer",
        experience: "5 Jahre",
        skills: ["User Research", "Figma", "Prototyping"],
        avatar: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      {
        id: "c2",
        name: "Maximilian Berger",
        role: "Full-Stack Developer",
        experience: "6 Jahre",
        skills: ["React", "Node.js", "TypeScript"],
        avatar: "https://randomuser.me/api/portraits/men/42.jpg"
      }
    ],
    'dummy-2': [
      {
        id: "c3",
        name: "Sophia Wagner",
        role: "Senior Data Scientist",
        experience: "8 Jahre",
        skills: ["Machine Learning", "Python", "Data Analysis"],
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      {
        id: "c4",
        name: "Julian Müller",
        role: "DevOps Engineer",
        experience: "7 Jahre",
        skills: ["AWS", "Docker", "Kubernetes"],
        avatar: "https://randomuser.me/api/portraits/men/29.jpg"
      },
      {
        id: "c5",
        name: "Laura Fischer",
        role: "Project Manager",
        experience: "9 Jahre",
        skills: ["Agile", "Scrum", "Risk Management"],
        avatar: "https://randomuser.me/api/portraits/women/17.jpg"
      }
    ],
    'dummy-3': [
      {
        id: "c6",
        name: "Thomas Klein",
        role: "Market Research Analyst",
        experience: "10 Jahre",
        skills: ["Market Analysis", "SPSS", "Consumer Behavior"],
        avatar: "https://randomuser.me/api/portraits/men/52.jpg"
      },
      {
        id: "c7",
        name: "Alexandra Weber",
        role: "Business Consultant",
        experience: "12 Jahre",
        skills: ["Strategy", "Business Development", "E-Commerce"],
        avatar: "https://randomuser.me/api/portraits/women/23.jpg"
      }
    ]
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      if (id === 'new') {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002';

        // Projekt laden
        const projectResponse = await axios.get(`${apiUrl}/projects/${id}`);
        setProject(projectResponse.data);

        // Consultants für das Projekt laden
        const consultantsResponse = await axios.get(`${apiUrl}/projects/${id}/consultants`);
        setConsultants(consultantsResponse.data.consultants);

        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Fehler beim Laden der Projektdaten:', error);
        setError('API-Verbindungsfehler. Zeige Demo-Daten.');

        // Fallback zu Dummy-Daten
        if (id.startsWith('dummy-')) {
          setProject(dummyProjects[id]);
          setConsultants(dummyConsultantsByProject[id] || []);
        } else {
          // Wenn keine passende ID gefunden wird, zeige das erste Dummy-Projekt
          setProject(dummyProjects['dummy-1']);
          setConsultants(dummyConsultantsByProject['dummy-1'] || []);
        }

        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleSendToClient = () => {
    alert(`Projekt "${project?.title}" wurde an den Kunden gesendet!`);
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  if (loading) {
    return <div className="loading-container">Projekt wird geladen...</div>;
  }

  if (id === 'new') {
    return (
      <div className="one-project-page">
        <div className="one-project-container">
          <div className="project-header-actions">
            <button className="back-button" onClick={handleBackToProjects}>
              ← Zurück zur Übersicht
            </button>
          </div>

          <h1 className="project-title">Neues Projekt erstellen</h1>
          <div className="new-project-form">
            <p>Hier kommt später ein Formular zur Projekterstellung...</p>
            <button className="back-button" onClick={handleBackToProjects}>
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error-container">
        <h2>Projekt nicht gefunden</h2>
        <button onClick={handleBackToProjects}>Zurück zur Übersicht</button>
      </div>
    );
  }

  return (
    <div className="one-project-page">
      <div className="one-project-container">
        <div className="project-header-actions">
          <button className="back-button" onClick={handleBackToProjects}>
            ← Zurück zur Übersicht
          </button>
          <StatusBadge status={project.status} />
        </div>

        <h1 className="project-title">{project.title}</h1>
        <p className="project-subtitle">{project.subtitle}</p>

        <div className="project-details-card">
          <div className="project-info-section">
            <div className="project-info-column">
              <div className="info-item">
                <span className="info-label">Kunde:</span>
                <span className="info-value">{project.client}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Zeitrahmen:</span>
                <span className="info-value">{project.timeline}</span>
              </div>
            </div>

            <div className="project-info-column">
              <div className="info-item">
                <span className="info-label">Start:</span>
                <span className="info-value">{project.startDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ende:</span>
                <span className="info-value">{project.endDate}</span>
              </div>
            </div>

            <div className="project-info-column">
              <div className="info-item">
                <span className="info-label">Budget:</span>
                <span className="info-value">{project.budget}</span>
              </div>
            </div>
          </div>

          <div className="project-description-section">
            <h3>Projektbeschreibung</h3>
            <p>{project.description}</p>
          </div>

          {project.goals && project.goals.length > 0 && (
            <div className="project-goals-section">
              <h3>Projektziele</h3>
              <ul>
                {project.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="consultants-section">
          <h2>Projekt-Team</h2>
          <div className="consultants-grid">
            {consultants.length > 0 ? (
              consultants.map(consultant => (
                <ConsultantCard key={consultant.id} consultant={consultant} />
              ))
            ) : (
              <div className="no-consultants">
                Diesem Projekt sind noch keine Consultants zugewiesen.
              </div>
            )}
          </div>
        </div>

        <div className="project-actions">
          <button className="send-client-btn" onClick={handleSendToClient}>
            An Kunden senden
          </button>
        </div>
      </div>
    </div>
  );
};

export default OneProject;