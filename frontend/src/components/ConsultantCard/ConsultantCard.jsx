// frontend/src/components/ConsultantCard/ConsultantCard.jsx
import React from 'react';
import './ConsultantCard.css';

const ConsultantCard = ({ consultant, onAccept, onReject }) => {
  return (
    <div className="consultant-card">
      <div className="consultant-actions">
        <button 
          className="consultant-action-btn reject-btn" 
          onClick={onReject}
          title="Consultant ablehnen"
        >
          ✕
        </button>
      </div>
      <div className="consultant-avatar">
        <img src={consultant.avatar || 'https://via.placeholder.com/80'} alt={consultant.name} />
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
