// frontend/src/components/ConsultantCard/ConsultantCard.jsx
import React from 'react';
import './ConsultantCard.css';
import { useNavigate } from 'react-router-dom';

const ConsultantCard = ({ consultant, onAccept, onReject }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/ConsultantView/${consultant.id}`);
  };

  const handleRejectClick = (e) => {
    e.stopPropagation(); // verhindert Klick auf Card
    onReject();
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
        <img src={consultant.profile_image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt={consultant.name} />
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
