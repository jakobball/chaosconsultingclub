import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProjectsPage from './pages/Projects/ProjectsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        {/* Standardumleitung zur Projektseite */}
        <Route path="/" element={<Navigate to="/projects" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
