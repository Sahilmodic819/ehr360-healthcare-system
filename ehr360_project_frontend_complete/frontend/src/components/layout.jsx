import React from "react";
import { motion } from "framer-motion";
import { Home, User, FileText, Activity, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-sky-600 to-sky-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">EHR360</div>
        <nav className="flex-1 space-y-2 px-4">
          <Link to="/" className="flex items-center space-x-2 p-2 rounded hover:bg-sky-700">
            <Home className="w-5 h-5" /> <span>Dashboard</span>
          </Link>
          <Link to="/patient/profile" className="flex items-center space-x-2 p-2 rounded hover:bg-sky-700">
            <User className="w-5 h-5" /> <span>Profile</span>
          </Link>
          <Link to="/patient/records" className="flex items-center space-x-2 p-2 rounded hover:bg-sky-700">
            <FileText className="w-5 h-5" /> <span>Medical Records</span>
          </Link>
          <Link to="/patient/symptoms" className="flex items-center space-x-2 p-2 rounded hover:bg-sky-700">
            <Activity className="w-5 h-5" /> <span>Symptoms</span>
          </Link>
          <Link to="/patient/insurance" className="flex items-center space-x-2 p-2 rounded hover:bg-sky-700">
            <Shield className="w-5 h-5" /> <span>Insurance</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
