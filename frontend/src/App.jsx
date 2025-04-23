import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ConsultantView from './pages/ConsultantView/ConsultantView';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
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