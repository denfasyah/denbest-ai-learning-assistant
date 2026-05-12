import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LearningPage from './pages/learning/LearningPage';
import WorkspacePage from './pages/workspace/WorkspacePage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/profile/ProfilePage';
import AssistantPage from './pages/assistant/AssistantPage';
import NotesPage from './pages/notes/NotesPage';
import HistoryPage from './pages/history/HistoryPage';
import SettingsPage from './pages/profile/SettingPage';
import NotificationPage from './pages/profile/NotificationPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />
            
            {/* Action Routes */}
            <Route path="/logout" element={<Navigate to="/login" replace />} />
            
            {/* Protected Routes Wrapper */}
            <Route 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/learning/workspace/:id" element={<WorkspacePage />} />
              <Route path="/learning/workspace/:id/:tab" element={<WorkspacePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/setting" element={<SettingsPage />} />
              <Route path="/notification" element={<NotificationPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

