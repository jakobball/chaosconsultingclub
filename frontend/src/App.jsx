import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProjectsPage from './pages/Projects/ProjectsPage';
import OneProject from './pages/OneProject_OP/OneProject';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<OneProject />} />
        {/* Standardumleitung zur Projektseite */}
        <Route path="/" element={<Navigate to="/projects" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;