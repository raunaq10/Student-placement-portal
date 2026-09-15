import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  FileCheck,
  BarChart3,
  Users,
  PlusCircle,
  FolderGit2,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const roleBadgeColor = {
    student: "bg-emerald-100 text-emerald-800 border-emerald-200",
    recruiter: "bg-blue-100 text-blue-800 border-blue-200",
    admin: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-tight">
                  Place<span className="text-indigo-600">Portal</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  Campus Placement Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {/* Student Navigation */}
                {user.role === "student" && (
                  <>
                    <Link
                      to="/student/dashboard"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive("/student/dashboard")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/student/jobs"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive("/student/jobs")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Job Drives
                    </Link>
                    <Link
                      to="/student/applications"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive("/student/applications")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/student/profile"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive("/student/profile")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Placement Profile
                    </Link>
                  </>
                )}

                {/* Recruiter Navigation */}
                {user.role === "recruiter" && (
                  <>
                    <Link
                      to="/recruiter/dashboard"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive("/recruiter/dashboard")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Recruiter Dashboard
                    </Link>
                    <Link
                      to="/recruiter/post-job"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive("/recruiter/post-job")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <PlusCircle className="w-4 h-4" /> Post New Job
                    </Link>
                    <Link
                      to="/recruiter/applicants"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive("/recruiter/applicants")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Candidates
                    </Link>
                    <Link
                      to="/recruiter/company"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive("/recruiter/company")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Company Info
                    </Link>
                  </>
                )}

                {/* Admin Navigation */}
                {user.role === "admin" && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive("/admin/dashboard")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" /> Placement Analytics
                    </Link>
                    <Link
                      to="/admin/students"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive("/admin/students")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Users className="w-4 h-4" /> Students
                    </Link>
                    <Link
                      to="/admin/companies"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive("/admin/companies")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Building2 className="w-4 h-4" /> Companies
                    </Link>
                    <Link
                      to="/admin/drives"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive("/admin/drives")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <FolderGit2 className="w-4 h-4" /> Drives
                    </Link>
                    <Link
                      to="/admin/records"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive("/admin/records")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <FileCheck className="w-4 h-4" /> Placement Records
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Home
                </Link>
                <Link
                  to="/student/jobs"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Explore Drives
                </Link>
              </>
            )}
          </div>

          {/* User profile / Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border mt-0.5 ${
                      roleBadgeColor[user.role] || "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {user.role === "admin" ? "Placement Officer" : user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {user ? (
            <>
              <div className="py-2 border-b border-slate-100 mb-2">
                <div className="font-bold text-sm text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-100 text-indigo-800 mt-1">
                  {user.role}
                </span>
              </div>

              {user.role === "student" && (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/student/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Job Drives
                  </Link>
                  <Link
                    to="/student/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Placement Profile
                  </Link>
                </>
              )}

              {user.role === "recruiter" && (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/recruiter/post-job"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Post New Job
                  </Link>
                  <Link
                    to="/recruiter/applicants"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Candidates
                  </Link>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Placement Analytics
                  </Link>
                  <Link
                    to="/admin/students"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Manage Students
                  </Link>
                  <Link
                    to="/admin/companies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Manage Companies
                  </Link>
                  <Link
                    to="/admin/records"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Placement Records
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50 mt-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
