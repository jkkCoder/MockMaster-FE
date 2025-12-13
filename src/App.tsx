import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { MockDetails } from './pages/MockDetails';
import { TestPage } from './pages/TestPage';
import { Results } from './pages/Results';
import { ViewAnswers } from './pages/ViewAnswers';
import { MyAttempts } from './pages/MyAttempts';
import { AttemptDetails } from './pages/AttemptDetails';
import { NotFound } from './pages/NotFound';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/mock/:mockId/details"
          element={
            <ProtectedRoute>
              <MockDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock/:mockId/answers"
          element={
            <ProtectedRoute>
              <ViewAnswers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-attempts"
          element={
            <ProtectedRoute>
              <MyAttempts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attempt/:attemptId/details"
          element={
            <ProtectedRoute>
              <AttemptDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:attemptId"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <NotFound />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
