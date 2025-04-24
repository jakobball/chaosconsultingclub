import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CustomerOverview.css';
import axios from 'axios';

function CustomerOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002';
        const response = await axios.get(`${apiUrl}/client/${id}`);
        setCustomer(response.data);
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden des Kunden:', err);
        setError('Kunde nicht gefunden');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) return <div className="loading-container">Lade Kundendaten...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="customer-overview-container">
      <div className="customer-header">
        <h1>{customer.name}</h1>
        <div className="customer-industry-badge">{customer.industry}</div>
      </div>

      <div className="customer-details-grid">
        <div className="customer-detail-card">
          <h3>Company Information</h3>
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{customer.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Employees:</span>
            <span className="detail-value">{customer.number_of_employees}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Website:</span>
            <a
              href={customer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-value website-link"
            >
              {customer.website}
            </a>
          </div>
        </div>

        <div className="customer-detail-card">
          <h3>Contact Information</h3>
          <div className="detail-item">
            <span className="detail-label">Contact Person:</span>
            <span className="detail-value">{customer.contact_person}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <a href={`mailto:${customer.contact_email}`} className="detail-value">
              {customer.contact_email}
            </a>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <a href={`tel:${customer.contact_phone}`} className="detail-value">
              {customer.contact_phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerOverview;
