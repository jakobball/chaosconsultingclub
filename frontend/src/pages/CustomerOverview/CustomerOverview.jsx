import React from 'react';
import './CustomerOverview.css';
import { useNavigate } from 'react-router-dom';


function CustomerOverview() {
  // Dummy customer data for display
  const customer = {
    name: "Acme Corporation",
    industry: "Technology",
    location: "Berlin, Germany",
    number_of_employees: 250,
    contact_person: "Jane Doe",
    contact_email: "jane.doe@acmecorp.com",
    contact_phone: "+49 123 456789",
    website: "https://www.acmecorp.com"
  };
const navigate = useNavigate();


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
            <a href={customer.website} target="_blank" rel="noopener noreferrer" className="detail-value website-link">{customer.website}</a>
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
            <a href={`mailto:${customer.contact_email}`} className="detail-value">{customer.contact_email}</a>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <a href={`tel:${customer.contact_phone}`} className="detail-value">{customer.contact_phone}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerOverview;
