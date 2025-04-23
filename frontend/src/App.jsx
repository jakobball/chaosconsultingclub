import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ConsultantView from './pages/ConsultantView/ConsultantView';
import OneProject from './pages/OneProject_OP/OneProject';
import UploadProject from './pages/UploadProject/UploadProject';
import CustomerOverview from './pages/CustomerOverview/CustomerOverview';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/new" element={<UploadProject />} />
          <Route path="/project/:id" element={<OneProject />} />
          <Route path="/" element={<Navigate to="/projects" />} />
          <Route path="/ConsultantView" element={
            <ErrorBoundary>
              <ConsultantView />
            </ErrorBoundary>
          } />
          <Route path="/customers" element={
            <ErrorBoundary>
              <CustomerOverview />
            </ErrorBoundary>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
