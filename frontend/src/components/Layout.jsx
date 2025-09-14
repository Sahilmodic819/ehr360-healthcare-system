// frontend/src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user info from localStorage
    const userRole = localStorage.getItem('ehr_role');
    const userName = localStorage.getItem('ehr_userName') || 'User';
    const userEmail = localStorage.getItem('ehr_email') || '';
    
    setUser({ role: userRole, name: userName, email: userEmail });
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const patientNavItems = [
    { path: '/patient/dashboard', name: 'Dashboard', icon: '🏠' },
    { path: '/patient/profile', name: 'Profile', icon: '👤' },
    { path: '/patient/symptoms', name: 'Symptoms', icon: '🩺' },
    { path: '/patient/records', name: 'Medical Records', icon: '📋' },
    { path: '/patient/labs', name: 'Lab Reports', icon: '🧪' },
    { path: '/patient/medications', name: 'Medications', icon: '💊' },
    { path: '/patient/allergies', name: 'Allergies', icon: '⚠️' },
    { path: '/patient/immunizations', name: 'Immunizations', icon: '💉' },
    { path: '/patient/treatments', name: 'Treatments', icon: '🏥' },
    { path: '/patient/insurance', name: 'Insurance', icon: '🛡️' }
  ];

  const doctorNavItems = [
    { path: '/doctor/dashboard', name: 'Dashboard', icon: '🏠' },
    { path: '/doctor/patients', name: 'My Patients', icon: '👥' },
    { path: '/doctor/search', name: 'Search Patients', icon: '🔍' },
    { path: '/doctor/insurance-requests', name: 'Insurance Requests', icon: '📝' }
  ];

  const insurerNavItems = [
    { path: '/insurer/dashboard', name: 'Dashboard', icon: '🏠' },
    { path: '/insurer/clients', name: 'My Clients', icon: '👥' },
    { path: '/insurer/search', name: 'Search Clients', icon: '🔍' },
    { path: '/insurer/claims', name: 'Claims Review', icon: '📊' },
    { path: '/insurer/risk', name: 'Risk Analysis', icon: '📈' }
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'doctor': return doctorNavItems;
      case 'insurer': return insurerNavItems;
      default: return patientNavItems;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">EHR</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">EHR 360</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header - Mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">EHR 360</h1>
            <div className="w-8"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
