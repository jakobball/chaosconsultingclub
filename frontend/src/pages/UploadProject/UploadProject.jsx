// frontend/src/pages/UploadProject/UploadProject.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadProject.css';

const UploadProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    budget: '',
    required_skills: '',  // New field for required skills
    status: 'planned', // Status is automatically set to "planned"
  });

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    priorities: '', // New field for customer priorities
  });

  const [errors, setErrors] = useState({});

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value
    });

    // Remove errors for this field when user edits it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value
    });

    // Remove errors for this field when user edits it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateProjectForm = () => {
    const newErrors = {};

    if (!projectData.title.trim()) newErrors.title = 'Title is required';
    if (!projectData.description.trim()) newErrors.description = 'Description is required';
    if (!projectData.location.trim()) newErrors.location = 'Location is required';
    if (!projectData.start_date) newErrors.start_date = 'Start date is required';

    // Budget validation
    if (projectData.budget && isNaN(Number(projectData.budget))) {
      newErrors.budget = 'Budget must be a number';
    }

    // Date validation
    if (projectData.start_date && projectData.end_date) {
      const start = new Date(projectData.start_date);
      const end = new Date(projectData.end_date);
      if (end < start) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    return newErrors;
  };

  const validateCustomerForm = () => {
    const newErrors = {};

    if (!customerData.name.trim()) newErrors.name = 'Name is required';
    if (!customerData.email.trim()) newErrors.email = 'Email is required';
    if (!customerData.company.trim()) newErrors.company = 'Company is required';

    // Email validation
    if (customerData.email && !/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Invalid email format';
    }

    return newErrors;
  };

  const handleNextStep = () => {
    const validationErrors = validateProjectForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validateCustomerForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    // Hilfsfunktionen zur sicheren Umwandlung
const safeString = (value) => {
  return value && value.trim() !== "" ? value : null;
};

const safeInt = (value) => {
  const num = Number(value);
  return !isNaN(num) ? num : null;
};

const parseRequirements = () => {
  if (!projectData.required_skills) return [];
  return projectData.required_skills.split(',').map(skill => ({
    skill: skill.trim(),
    amount: 1,
    recommendedSeniority: "Intermediate"
  }));
};

// Finaler, kombinierter Payload
const payload = {
  project: {
    title: safeString(projectData.title),
    description: safeString(projectData.description),
    location: safeString(projectData.location),
    start_date: projectData.start_date,
    end_date: projectData.end_date || null,
    budget: projectData.budget !== "" ? Number(projectData.budget) : null,
    status: safeString(projectData.status),
    customer_priorities: safeString(customerData.priorities),
    project_feedback_rating: null,
    project_feedback_comment: null,
    requirements: parseRequirements()
  },
  customer: {
    name: safeString(customerData.name),                          // ✅ Pflichtfeld
    industry: safeString(customerData.company),
    location: safeString(projectData.location),                   // ggf. eigenständig setzen
    number_of_employees: null,                                    // optional, UI fehlt
    contact_person: safeString(customerData.position),
    contact_email: safeString(customerData.email),
    contact_phone: safeString(customerData.phone),
    website: null                                                 // optional
  }
};

    try {
      const response = await fetch('http://localhost:8002/project/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) throw new Error("Projekt konnte nicht erstellt werden");
  
      alert('Projekt erfolgreich erstellt!');
      navigate('/projects');
    } catch (error) {
      console.error('Fehler beim Erstellen des Projekts:', error);
      alert('Fehler beim Erstellen. Bitte erneut versuchen.');
    }
  };
  
  

  const handleCancel = () => {
    navigate('/projects');
  };

  // Project properties form (Step 1)
  const renderProjectForm = () => (
    <>
      <h2 className="step-title">Step 1: Project Details</h2>
      <div className="form-group">
        <label htmlFor="title">Title*</label>
        <input
          type="text"
          id="title"
          name="title"
          value={projectData.title}
          onChange={handleProjectInputChange}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description*</label>
        <textarea
          id="description"
          name="description"
          value={projectData.description}
          onChange={handleProjectInputChange}
          rows="4"
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="required_skills">Required Skills</label>
        <textarea
          id="required_skills"
          name="required_skills"
          value={projectData.required_skills}
          onChange={handleProjectInputChange}
          rows="3"
          placeholder="e.g. Python, React, UI/UX Design, Marketing, Financial Analysis"
          className={errors.required_skills ? 'error' : ''}
        />
        {errors.required_skills && <span className="error-message">{errors.required_skills}</span>}
        <span className="help-text">Please specify the skills needed for this project (comma separated).</span>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location*</label>
        <input
          type="text"
          id="location"
          name="location"
          value={projectData.location}
          onChange={handleProjectInputChange}
          className={errors.location ? 'error' : ''}
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="start_date">Start Date*</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={projectData.start_date}
            onChange={handleProjectInputChange}
            className={errors.start_date ? 'error' : ''}
          />
          {errors.start_date && <span className="error-message">{errors.start_date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={projectData.end_date}
            onChange={handleProjectInputChange}
            className={errors.end_date ? 'error' : ''}
          />
          {errors.end_date && <span className="error-message">{errors.end_date}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="budget">Budget (€)</label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={projectData.budget}
          onChange={handleProjectInputChange}
          className={errors.budget ? 'error' : ''}
        />
        {errors.budget && <span className="error-message">{errors.budget}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" className="next-btn" onClick={handleNextStep}>
          Next
        </button>
      </div>
    </>
  );

  // Customer data form (Step 2)
  const renderCustomerForm = () => (
    <>
      <h2 className="step-title">Step 2: Customer Information</h2>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerData.name}
            onChange={handleCustomerInputChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerData.email}
            onChange={handleCustomerInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="company">Company*</label>
          <input
            type="text"
            id="company"
            name="company"
            value={customerData.company}
            onChange={handleCustomerInputChange}
            className={errors.company ? 'error' : ''}
          />
          {errors.company && <span className="error-message">{errors.company}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customerData.phone}
            onChange={handleCustomerInputChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="position">Position</label>
        <input
          type="text"
          id="position"
          name="position"
          value={customerData.position}
          onChange={handleCustomerInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="priorities">Customer Priorities</label>
        <textarea
          id="priorities"
          name="priorities"
          value={customerData.priorities}
          onChange={handleCustomerInputChange}
          rows="3"
          placeholder="e.g. short project duration, budget adherence, high quality, innovation"
          className={errors.priorities ? 'error' : ''}
        />
        {errors.priorities && <span className="error-message">{errors.priorities}</span>}
        <span className="help-text">Here you can specify which aspects are particularly important to the client.</span>
      </div>

      <div className="form-actions">
        <button type="button" className="back-btn" onClick={handlePrevStep}>
          Back
        </button>
        <button type="submit" className="submit-btn">
          Create Project
        </button>
      </div>
    </>
  );

  return (
    <div className="upload-project-page">
      <div className="upload-project-container">
        <h1>Create New Project</h1>
        
        <div className="form-step-indicator">
          <div className={`step ${currentStep === 1 ? 'active' : ''}`}>1 Project Details</div>
          <div className={`step ${currentStep === 2 ? 'active' : ''}`}>2 Customer Information</div>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          {currentStep === 1 ? renderProjectForm() : renderCustomerForm()}
        </form>
      </div>
    </div>
  );
};

export default UploadProject;

