import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OneProject.css';

const OneProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Beispiel-Projektdaten (in der Produktion würden diese von der API geholt)
  const project = {
    id: id || "1",
    title: "KI-gestütztes Matching-System",
    subtitle: "Automatisierung des Consultant-Matching-Prozesses",
    status: "in_progress",
    description: "Entwicklung eines intelligenten Systems, das Consultants basierend auf ihren Fähigkeiten, Erfahrungen und Verfügbarkeit optimal mit Kundenprojekten matcht. Das Tool soll den manuellen Zuweisungsprozess automatisieren, die Teamzusammenstellung optimieren und die Projektplanung verbessern.",
    client: "TechVision GmbH",
    timeline: "3 Monate",
    budget: "85.000 €",
    startDate: "01.06.2023",
    endDate: "31.08.2023",
    goals: [
      "Entwicklung eines Algorithmus für optimales Consultant-Matching",
      "Integrierte Analyse von Fähigkeiten und Projekterfahrungen",
      "Implementierung einer benutzerfreundlichen Dashboard-Oberfläche",
      "Automatisierte Empfehlungen für Projektteams"
    ]
  };

  // Beispiel-Consultants für das Projekt
  const consultants = [
    {
      id: "1",
      name: "Sophia Wagner",
      role: "Senior Data Scientist",
      experience: "8 Jahre",
      skills: ["Machine Learning", "Python", "Data Analysis", "Neural Networks"],
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      id: "2",
      name: "Maximilian Berger",
      role: "Full-Stack Developer",
      experience: "6 Jahre",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    {
      id: "3",
      name: "Emma Schneider",
      role: "UX/UI Designer",
      experience: "5 Jahre",
      skills: ["User Research", "Figma", "Prototyping", "Usability Testing"],
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: "4",
      name: "Julian Müller",
      role: "DevOps Engineer",
      experience: "7 Jahre",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      avatar: "https://randomuser.me/api/portraits/men/29.jpg"
    },
    {
      id: "5",
      name: "Laura Fischer",
      role: "Project Manager",
      experience: "9 Jahre",
      skills: ["Agile", "Scrum", "Risk Management", "Stakeholder Management"],
      avatar: "https://randomuser.me/api/portraits/women/17.jpg"
    }
  ];

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
    const statusLabels = {
      'open': 'Offen',
      'in_progress': 'In Bearbeitung',
      'completed': 'Abgeschlossen',
      'cancelled': 'Abgebrochen'
    };
    return statusLabels[status] || status;
  };

  const handleSendToClient = () => {
    alert(`Projekt "${project.title}" wurde an den Kunden gesendet!`);
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="one-project-page">
      <div className="one-project-container">
        <div className="project-header-actions">
          <button className="back-button" onClick={handleBackToProjects}>
            ← Zurück zur Übersicht
          </button>
          <div className={`project-status ${getStatusClass(project.status)}`}>
            {getStatusLabel(project.status)}
          </div>
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

          <div className="project-goals-section">
            <h3>Projektziele</h3>
            <ul>
              {project.goals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="consultants-section">
          <h2>Projekt-Team</h2>
          <div className="consultants-grid">
            {consultants.map(consultant => (
              <div key={consultant.id} className="consultant-card">
                <div className="consultant-avatar">
                  <img src={consultant.avatar} alt={consultant.name} />
                </div>
                <div className="consultant-info">
                  <h3>{consultant.name}</h3>
                  <div className="consultant-role">{consultant.role}</div>
                  <div className="consultant-experience">
                    <span className="info-label">Erfahrung:</span> {consultant.experience}
                  </div>
                  <div className="consultant-skills">
                    {consultant.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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