import React from 'react';
import './ConsultantCard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConsultantCard = ({ consultant }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/ConsultantView/${consultant.id}`);
  };

  const handleRejectClick = async (e) => {
    e.stopPropagation(); // verhindert Weiterleitung zur Card

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002';
    try {
      await axios.delete(`${apiUrl}/recommendation/deleteStaffing/${consultant.project_id}/${consultant.id}`);
      window.location.reload(); // Seite neu laden nach erfolgreichem Delete
    } catch (err) {
      console.error("Fehler beim Löschen des Consultants:", err);
      alert("Löschen fehlgeschlagen.");
    }
  };

  return (
    <div className="consultant-card clickable" onClick={handleCardClick}>
      <div className="consultant-actions">
        <button
          className="consultant-action-btn reject-btn"
          onClick={handleRejectClick}
          title="Consultant ablehnen"
        >
          ✕
        </button>
      </div>
      <div className="consultant-avatar">
        <img
          src={consultant.profile_image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
          alt={consultant.name}
        />
      </div>

      <div className="consultant-info">
        <h3>{consultant.name}</h3>
        <div className="consultant-role">{consultant.role}</div>
        <div className="consultant-experience">
          <span className="info-label">Erfahrung:</span> {consultant.experience}
        </div>
        <div className="consultant-skills">
          {consultant.skills && consultant.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;
