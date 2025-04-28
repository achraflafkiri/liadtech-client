import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-xl">Événements Sportifs</span>
          </div>
          <div className="space-x-4">
            <Link to="/" className="hover:text-blue-200 font-medium">Accueil</Link>
            <Link to="/add" className="bg-white text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition">Ajouter un événement</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;