import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Briefcase, ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      redirectUser(data.user.role);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role) => {
    if (role === "student") navigate("/student/dashboard");
    else if (role === "recruiter") navigate("/recruiter/dashboard");
    else if (role === "admin") navigate("/admin/dashboard");
    else navigate("/");
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError("");

    try {
      const data = await login(demoEmail, demoPassword);
      redirectUser(data.user.role);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-200">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Placement Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your student, recruiter, or placement administration account
          </p>
        </div>

        {/* 1-Click Quick Demo Login Card */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              1-Click Demo Accounts (Instant Test)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("student@placement.edu", "student123")}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-center transition-all group shadow-sm disabled:opacity-50"
            >
              <GraduationCap className="w-5 h-5 mx-auto mb-1 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700">
                Student
              </div>
              <div className="text-[9px] text-slate-400">Arjun (8.85 CGPA)</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("recruiter@techcorp.com", "recruiter123")}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-center transition-all group shadow-sm disabled:opacity-50"
            >
              <Briefcase className="w-5 h-5 mx-auto mb-1 text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-bold text-slate-800 group-hover:text-blue-700">
                Recruiter
              </div>
              <div className="text-[9px] text-slate-400">Google HR</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin@placement.edu", "admin123")}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-center transition-all group shadow-sm disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-purple-600 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-bold text-slate-800 group-hover:text-purple-700">
                Admin
              </div>
              <div className="text-[9px] text-slate-400">Dean Placement</div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@placement.edu"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Sign In to Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
