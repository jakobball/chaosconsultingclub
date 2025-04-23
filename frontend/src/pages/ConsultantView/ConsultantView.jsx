import React, { useState, useEffect } from 'react';
import './ConsultantView.css';

const ConsultantView = () => {
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [currentDateTime] = useState("2025-04-23 18:27:04");
  const [currentUser] = useState("");

  useEffect(() => {
    // Simulate API request with available fields from schema
    setTimeout(() => {
      const data = {
        id: "CON-2025-042",
        name: "ConsultantName",
        role: "Senior Cloud Architect",
        seniority: "Senior",
        description: "Senior IT consultant with over 8 years of experience in designing and implementing cloud solutions and digital transformation projects. Specialized in AWS infrastructures and agile methodology with a proven track record in the finance and insurance industry.",
        certificates: JSON.stringify([
          {
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            year: "2023"
          },
          {
            name: "Certified Scrum Master",
            issuer: "Scrum Alliance",
            year: "2022"
          },
          {
            name: "ITIL 4 Foundation",
            issuer: "Axelos",
            year: "2022"
          }
        ]),
        technologies: JSON.stringify([
          { name: "AWS", level: 90 },
          { name: "Cloud Architecture", level: 85 },
          { name: "Terraform", level: 80 },
          { name: "Kubernetes", level: 75 },
          { name: "Docker", level: 85 },
          { name: "Python", level: 70 },
          { name: "JavaScript", level: 65 },
          { name: "CI/CD", level: 80 }
        ]),
        languages_spoken: JSON.stringify([
          { name: "German", level: "Native" },
          { name: "English", level: "Fluent (C1)" },
          { name: "Spanish", level: "Basic (A2)" }
        ]),
        skillset_ranking: "Expert in Cloud Architecture, Advanced in DevOps, Intermediate in Frontend Development",
        availability: "Partially available from May 15, 2025",
        location: "Munich, DE"
      };

      setConsultant(data);
      setProfileData({...data});
      setLoading(false);
    }, 800);
  }, []);

  // Parse JSON data from strings
  const parseCertificates = () => {
    try {
      return JSON.parse(consultant.certificates || '[]');
    } catch (e) {
      console.error("Error parsing certificates:", e);
      return [];
    }
  };

  const parseTechnologies = () => {
    try {
      return JSON.parse(consultant.technologies || '[]');
    } catch (e) {
      console.error("Error parsing technologies:", e);
      return [];
    }
  };

  const parseLanguages = () => {
    try {
      return JSON.parse(consultant.languages_spoken || '[]');
    } catch (e) {
      console.error("Error parsing languages:", e);
      return [];
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle profile edit
  const handleEditProfile = () => {
    setEditingProfile(true);
    setProfileData({...consultant});
  };

  // Handle profile data change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Handle save profile
  const handleSaveProfile = () => {
    setConsultant({...profileData});
    setEditingProfile(false);
  };

  // Extract skill levels from ranking text
  const extractSkillLevels = () => {
    const skillRanking = consultant.skillset_ranking;
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
          <img src={`https://via.placeholder.com/150/3ED3AE/FFFFFF?text=${consultant.name.charAt(0)}`} alt={consultant.name} className="profile-photo" />
          <div className={`availability-indicator ${consultant.availability.includes('available') ? 'partially' : 'unavailable'}`}></div>
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
              <p className="skill-ranking-text">{consultant.skillset_ranking}</p>
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
                      <i className="icon calendar-icon"></i>
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
              <div className="tech-skills">
                <h4>Technical Stack</h4>
                <div className="skills-grid">
                  {parseTechnologies().map((tech, index) => (
                    <div key={index} className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{tech.name}</span>
                        <span className="skill-level">{tech.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-fill"
                          style={{ width: `${tech.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="skill-ranking-details">
                <h4>Skill Ranking</h4>
                <div className="skill-level-visualization">
                  {extractSkillLevels().map((skill, index) => (
                    <div key={index} className="skill-level-item">
                      <div className="skill-level-name">{skill.name}</div>
                      <div className="skill-level-bar-container">
                        <div className="skill-level-bar">
                          <div className="skill-level-marker" style={{ left: `${skill.value}%` }}></div>
                          <div className="skill-level-track">
                            <div className="track-segment beginner">Beginner</div>
                            <div className="track-segment intermediate">Intermediate</div>
                            <div className="track-segment advanced">Advanced</div>
                            <div className="track-segment expert">Expert</div>
                          </div>
                        </div>
                        <div className="skill-level-label">{skill.level}</div>
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
                          <p>Issued by: {cert.issuer}</p>
                          <p>Year: {cert.year}</p>
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

      <div className="last-updated">
        <p>Last updated: {currentDateTime} • User: {currentUser}</p>
      </div>
    </div>
  );
};

export default ConsultantView;