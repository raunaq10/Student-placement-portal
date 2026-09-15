import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import JobListings from "./pages/student/JobListings";
import JobDetails from "./pages/student/JobDetails";
import MyApplications from "./pages/student/MyApplications";

// Recruiter Pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/PostJob";
import ManageApplicants from "./pages/recruiter/ManageApplicants";
import CompanyProfile from "./pages/recruiter/CompanyProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageCompanies from "./pages/admin/ManageCompanies";
import ManageDrives from "./pages/admin/ManageDrives";
import PlacementRecords from "./pages/admin/PlacementRecords";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/student/jobs" element={<JobListings />} />
              <Route path="/student/jobs/:id" element={<JobDetails />} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/applications" element={<MyApplications />} />
              </Route>

              {/* Recruiter Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={["recruiter", "admin"]} />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/post-job" element={<PostJob />} />
                <Route path="/recruiter/applicants" element={<ManageApplicants />} />
                <Route path="/recruiter/company" element={<CompanyProfile />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<ManageStudents />} />
                <Route path="/admin/companies" element={<ManageCompanies />} />
                <Route path="/admin/drives" element={<ManageDrives />} />
                <Route path="/admin/records" element={<PlacementRecords />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4">
              <p>© {new Date().getFullYear()} Campus Student Placement Portal. All rights reserved.</p>
              <p className="mt-1 text-slate-400">
                A centralized institutional solution for students, recruiters, and placement administration.
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
