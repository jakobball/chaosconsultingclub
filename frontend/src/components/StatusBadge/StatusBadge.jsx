import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  // Mapping von DB-Status auf Anzeigetext
  const statusLabels = {
    'planned': 'Planned',
    'active': 'Active',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };

  // Fallback, falls ein unbekannter Status übergeben wird
  const label = statusLabels[status] || status;
  
  return (
    <span className={`status-badge status-${status}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
