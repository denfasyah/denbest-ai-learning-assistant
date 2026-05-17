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
import WorkspaceLayout from './features/workspace/pages/WorkspaceLayout';
import ContentTab from './features/workspace/components/ContentTab';
import ChatTab from './features/workspace/components/ChatTab';
import SummaryTab from './features/workspace/components/SummaryTab';
import FlashcardTab from './features/workspace/components/FlashcardTab';
import QuizTab from './features/workspace/components/QuizTab';
import QuizResultTab from './features/workspace/components/QuizResultTab';
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
              <Route path="/learning/workspace/:workspaceId" element={<WorkspaceLayout />}>
                <Route path="content" element={<ContentTab />} />
                <Route path="chat" element={<ChatTab />} />
                <Route path="summary" element={<SummaryTab />} />
                <Route path="flashcards" element={<FlashcardTab />} />
                <Route path="quiz" element={<QuizTab />} />
                <Route path="quiz/:quizId" element={<QuizResultTab />} />
              </Route>
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

