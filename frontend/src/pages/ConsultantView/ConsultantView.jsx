import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ConsultantView.css';

const ConsultantView = () => {
  const { id } = useParams();
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const currentDateTime = new Date().toLocaleString(); // ✅ hier hinzufügen
  const currentUser = "admin"

useEffect(() => {
  const fetchConsultant = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002';
      const response = await fetch(`${apiUrl}/consultant/get/${id}`);
      const data = await response.json();

      // 🔁 JSON-Handling anpassen
      data.certificates = Array.isArray(data.certificates) ? data.certificates : [];
      data.technologies = Array.isArray(data.technologies) ? data.technologies : [];
      data.languages_spoken = Array.isArray(data.languages_spoken) ? data.languages_spoken : [];

      // 🔁 skillset_ranking fixen (kommt als string)
      try {
        data.skillset_ranking = JSON.parse(data.skillset_ranking);
      } catch {
        data.skillset_ranking = [];
      }

      setConsultant(data);
      setProfileData({ ...data });
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden des Consultants:', error);
      setLoading(false);
    }
  };

  fetchConsultant();
}, [id]);

const parseCertificates = () => {
  try {
    const raw = consultant?.certificates || '[]';
    const certs = typeof raw === 'string' ? JSON.parse(raw) : raw;

    // Rückgabe als Objekt mit nur "name"
    return certs.map((cert) => ({
      name: cert
    }));
  } catch (e) {
    console.error("Error parsing certificates:", e);
    return [];
  }
};
const parseSkills = () => {
  try {
    const raw = consultant?.skills || '[]';
    const skills = typeof raw === 'string' ? JSON.parse(raw) : raw;

    return skills.map((entry) => {
      const [name, level] = entry.split(' - ');
      return { name: name.trim(), level: level?.trim() || '' };
    });
  } catch (e) {
    console.error("Error parsing skills:", e);
    return [];
  }
};


const parseTechnologies = () => {
  try {
    const raw = consultant?.technologies || '[]';
    const techs = typeof raw === 'string' ? JSON.parse(raw) : raw;

    return techs.map((entry) => {
      const [name] = entry.split(' - ');
      const randomLevel = Math.floor(Math.random() * (90 - 30 + 1)) + 30; // 30–90
      return { name: name.trim(), level: randomLevel };
    });
  } catch (e) {
    console.error("Error parsing technologies:", e);
    return [];
  }
};


const parseLanguages = () => {
  try {
    const raw = consultant?.languages_spoken || '[]';
    const langs = typeof raw === 'string' ? JSON.parse(raw) : raw;

    return langs.map((entry) => {
      const [name, level] = entry.split(' - ');
      return { name: name.trim(), level: level?.trim() || '' };
    });
  } catch (e) {
    console.error("Error parsing languages:", e);
    return [];
  }
};


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
    setProfileData({ ...consultant });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    setConsultant({ ...profileData });
    setEditingProfile(false);
  };

  const extractSkillLevels = () => {
    const skillRanking = consultant?.skillset_ranking || "";
    let skills = [];

    if (skillRanking.includes("Expert in")) {
      skills.push({ name: "Cloud Architecture", level: "Expert", value: 90 });
    }
    if (skillRanking.includes("Advanced in")) {
      skills.push({ name: "DevOps", level: "Advanced", value: 75 });
    }
    if (skillRanking.includes("Intermediate in")) {
      skills.push({ name: "Frontend Development", level: "Intermediate", value: 60 });
    }

    return skills;
  };



  if (loading || !consultant) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading consultant data...</p>
      </div>
    );
  }
 if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading consultant data...</p>
      </div>
    );
  }

  return (
    <div className="consultant-view">
      {/* Profile Header */}
      <section className="profile-section">
        <div className="profile-photo-container">
        <img src={ 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt={consultant.name} className="profile-photo" />
<div className={`availability-indicator ${consultant.availability?.toLowerCase().includes('available') ? 'partially' : 'unavailable'}`}></div>
        </div>
        <div className="profile-details">
          <div className="profile-header">
            <div>
              <h1>{consultant.name}</h1>
              <h2>{consultant.role}</h2>
              <p className="department">{consultant.seniority} • {consultant.location}</p>
            </div>
            <div className="profile-status">
              <div className="availability-badge-container">
                <span className="availability-badge partially">
                  {consultant.availability}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="contact-info">
              <p><i className="icon user-icon"></i> ID: {consultant.id}</p>
              <p><i className="icon location-icon"></i> {consultant.location}</p>
            </div>

            <div className="skill-ranking">
              <p className="skill-ranking-title">Skill Ranking:</p>
<p className="skill-ranking-text">
  {(Array.isArray(consultant.skillset_ranking)
    ? consultant.skillset_ranking.join(', ')
    : consultant.skillset_ranking)}
</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => handleTabChange('skills')}
        >
          Skills & Technologies
        </button>
        <button
          className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
          onClick={() => handleTabChange('certificates')}
        >
          Certificates & Languages
        </button>
      </div>

      <div className="tab-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <section className="profile-summary-section">
            <div className="section-header">
              <h3 className="section-title">Consultant Profile</h3>

            </div>

            {editingProfile ? (
              <div className="edit-profile-form">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleProfileChange}
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      value={profileData.role}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Seniority</label>
                    <select
                      name="seniority"
                      value={profileData.seniority}
                      onChange={handleProfileChange}
                    >
                      <option value="Junior">Junior</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Availability</label>
                  <input
                    type="text"
                    name="availability"
                    value={profileData.availability}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-actions">
                  <button className="cancel-button" onClick={() => setEditingProfile(false)}>
                    Cancel
                  </button>
                  <button className="save-button" onClick={handleSaveProfile}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-content">
                <div className="description-box">
                  <h4>Professional Summary</h4>
                  <p>{consultant.description}</p>
                </div>

                <div className="profile-highlights">
                  <div className="highlight-card">
                    <div className="highlight-icon">
                      <i className="icon experience-icon"></i>
                    </div>
                    <div className="highlight-content">
                      <h4>Seniority</h4>
                      <p>{consultant.seniority}</p>
                    </div>
                  </div>

                  <div className="highlight-card">
                    <div className="highlight-icon">
                      <i className="icon location-icon"></i>
                    </div>
                    <div className="highlight-content">
                      <h4>Location</h4>
                      <p>{consultant.location}</p>
                    </div>
                  </div>

                  <div className="highlight-card">
                    <div className="highlight-icon">
                <i className="icon availability-icon"></i>
                    </div>
                    <div className="highlight-content">
                      <h4>Availability</h4>
                      <p>{consultant.availability}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <section className="skills-section">
            <div className="section-header">
              <h3 className="section-title">Technologies & Skills</h3>
            </div>

            <div className="skills-content">
<div className="skill-ranking-details">
  <h4>Technology Stack</h4>
  <div className="skills-grid">
    {parseTechnologies().map((tech, index) => (
      <div key={index} className="skill-item">
        <div className="skill-header">
          <span className="skill-name">{tech.name}</span>
          <span className="skill-level">{tech.level}%</span>
        </div>
        <div className="skill-bar">
          <div className="skill-fill" style={{ width: `${tech.level}%` }}></div>
        </div>
      </div>
    ))}
  </div>
</div>

            </div>
          </section>
        )}

        {/* Certificates & Languages Tab */}
        {activeTab === 'certificates' && (
          <section className="certificates-section">
            <div className="section-header">
              <h3 className="section-title">Certificates & Languages</h3>
            </div>

            <div className="certificates-content">
              <div className="certificates-grid">
                <div className="subsection">
                  <h4>Certificates</h4>
<div className="certificates-list">
  {parseCertificates().map((cert, index) => (
    <div key={index} className="certificate-item">
      <div className="certificate-icon">
        <i className="icon cert-icon"></i>
      </div>
      <div className="certificate-details">
        <h5>{cert.name}</h5>
      </div>
    </div>
  ))}
</div>
                </div>

                <div className="subsection">
                  <h4>Languages</h4>
                  <div className="languages-list">
                    {parseLanguages().map((lang, index) => (
                      <div key={index} className="language-item">
                        <div className="language-name">{lang.name}</div>
                        <div className="language-level">{lang.level}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="last-updated-section">
        <button
          className="edit-profile-button"
          onClick={handleEditProfile}
        >
          <i className="icon edit-icon"></i>
          Edit Profile
        </button>
        <div className="last-updated">
          <p>Last updated: {currentDateTime} • User: {currentUser}</p>
        </div>
      </div>
    </div>
  );
};

export default ConsultantView;

