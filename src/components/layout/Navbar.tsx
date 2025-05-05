import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, GraduationCap, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Predict', path: '/predict' },
  { label: 'Upload Data', path: '/upload' },
  { label: 'About', path: '/about' },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            onClick={closeMenu}
          >
            <GraduationCap className="h-7 w-7" />
            <span className="font-bold text-xl hidden sm:inline">
              Student Performance Predictor
            </span>
            <span className="font-bold text-xl sm:hidden">
              SPP
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "font-medium transition-colors hover:text-blue-600",
                  location.pathname === item.path 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-down">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "py-2 px-4 rounded-md font-medium transition-colors",
                    location.pathname === item.path 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;