import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Scholarships from "./pages/student/Scholarships";
import ScholarshipDetails from "./pages/student/ScholarshipDetails";
import Recommendations from "./pages/student/Recommendations";
import Prediction from "./pages/student/Prediction";
import Improvements from "./pages/student/Improvements";
import Applications from "./pages/student/Applications";
import ApplicationDetails from "./pages/student/ApplicationDetails";
import ApplicationForm from "./pages/student/ApplicationForm";
import ApplicationSuccess from "./pages/student/ApplicationSuccess";
import Reports from "./pages/student/Reports";


import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Authentication */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Student Application */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/scholarships"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Scholarships />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/scholarships/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ScholarshipDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Recommendations />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Prediction />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/improvements"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Improvements />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Applications />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ApplicationDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/scholarships/:id/apply"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ApplicationForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/application-success"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ApplicationSuccess />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Reports />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
