
// frontend/src/pages/Landing.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">EHR</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">EHR 360</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">About Us</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Products</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">NDHM</a>
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex space-x-3">
              <Link 
                to="/register/patient" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                REGISTER
              </Link>
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                LOGIN
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Clouds */}
          <div className="absolute top-20 left-20 w-16 h-10 bg-white bg-opacity-20 rounded-full"></div>
          <div className="absolute top-32 right-32 w-20 h-12 bg-white bg-opacity-15 rounded-full"></div>
          <div className="absolute top-40 left-1/3 w-12 h-8 bg-white bg-opacity-10 rounded-full"></div>
          
          {/* Wind Turbines */}
          <div className="absolute bottom-20 left-32">
            <div className="w-1 h-20 bg-white bg-opacity-30 mx-auto"></div>
            <div className="w-8 h-8 border-2 border-white border-opacity-30 rounded-full relative -top-2 mx-auto">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-white bg-opacity-50"></div>
            </div>
          </div>
          <div className="absolute bottom-16 right-40">
            <div className="w-1 h-16 bg-white bg-opacity-20 mx-auto"></div>
            <div className="w-6 h-6 border-2 border-white border-opacity-20 rounded-full relative -top-2 mx-auto"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            Your Health, Your Data, Your Power
          </h1>
          
          {/* Central Icon with Heart */}
          <div className="mb-12 relative">
            <div className="inline-flex items-center justify-center">
              {/* Person Icon */}
              <div className="relative">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full mb-2"></div>
                </div>
                <div className="w-24 h-16 bg-yellow-400 rounded-t-full mx-auto -mt-2"></div>
                {/* Heart above */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-white text-opacity-90 mb-16 max-w-4xl mx-auto">
            EHR 360 is a revolutionary platform that simplifies and improves healthcare data management
          </p>
          
          {/* User Type Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Doctors */}
            <Link 
              to="/register/doctor" 
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6H9V4L3 7V9H21ZM20 10H4V22H20V10Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Doctors</h3>
            </Link>
            
            {/* Patients */}
            <Link 
              to="/register/patient" 
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Patients</h3>
            </Link>
            
            {/* Insurers */}
            <Link 
              to="/register/insurer" 
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Insurers</h3>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Privacy & Security</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Data Security</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Career</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Join Our Team</a></li>
                <li><a href="#" className="hover:text-blue-600">Open Positions</a></li>
                <li><a href="#" className="hover:text-blue-600">Company Culture</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Support</a></li>
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">EHR 360</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">© 2025 EHR 360 | Privacy and security</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
