// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import BiometricRegisterPage from "@/pages/BiometricRegisterPage";
import BiometricAuthPage from "@/pages/BiometricAuthPage";
import ElectionsPage from "@/pages/ElectionsPage";
import ElectionDetailPage from "@/pages/ElectionDetailPage";
import VoteConfirmationPage from "@/pages/VoteConfirmationPage";
import VerifyPage from "@/pages/VerifyPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import FAQPage from "@/pages/FAQPage";
import SecurityInfoPage from "@/pages/SecurityInfoPage";
import ContactPage from "@/pages/ContactPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import SessionTimeout from "@/pages/SessionTimeout";

const App = () => {
  const handleLogout = () => {
    // Clear auth state, redirect to login, etc.
  };

  const handleExtend = () => {
    // Reset session timer (re-render SessionTimeout)
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/security" element={<SecurityInfoPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Routes */}
          <Route
            path="/biometric-register"
            element={
              <ProtectedRoute>
                <BiometricRegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/biometric-auth"
            element={
              <ProtectedRoute>
                <BiometricAuthPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/elections"
            element={
              <ProtectedRoute>
                <ElectionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/elections/:id"
            element={
              <ProtectedRoute>
                <ElectionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vote-confirmation"
            element={
              <ProtectedRoute>
                <VoteConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirecting all other routes to home page */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
        <SessionTimeout onLogout={handleLogout} onExtend={handleExtend} />
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
