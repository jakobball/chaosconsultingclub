import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ConsultantView from './pages/ConsultantView/ConsultantView';
import OneProject from './pages/OneProject_OP/OneProject';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/new" element={<OneProject />} />
        <Route path="/project/:id" element={<OneProject />} />
        <Route path="/" element={<Navigate to="/projects" />} />
        <Route path="/ConsultantView" element={
          <ErrorBoundary>
            <ConsultantView />
          </ErrorBoundary>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;