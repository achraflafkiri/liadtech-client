import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl">Événements Sportifs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            <a href="/" className="hover:text-blue-200 font-medium">Accueil</a>
            <a href="/add" className="bg-white text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition">Ajouter un événement</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-4">
              <a
                href="/"
                className="hover:bg-blue-700 py-2 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </a>
              <a
                href="/add"
                className="bg-white text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Ajouter un événement
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;