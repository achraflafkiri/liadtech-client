import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Edit2, Trash2, AlertCircle, Plus, RefreshCw } from 'lucide-react';
import moment from 'moment'; 
import 'moment/locale/fr'; 
import EventService from '../services/EventService';
import { useNavigate } from 'react-router-dom';

// format dates from "2025-03-31T00:00:00.000Z" to "31 mars 2025"
const formatDate = (dateString) => {
  return moment(dateString).locale('fr').format('D MMMM YYYY');
};

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Open and close the popup
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventService.getAllEvents();
      // console.log("response: ", response.data.events);
      
      if (response.data && response.data.events) {
        setEvents(response.data.events);
      }

      setError(null);
    } catch (err) {
      setError('Error fetching events');
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => {
    // console.log("id: ", id);
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await EventService.deleteEvent(eventToDelete._id);
      
      // Animate out the deleted card
      const updatedEvents = events.filter(event => event._id !== eventToDelete._id);
      // console.log("updatedEvents: ", updatedEvents);      
      setEvents(updatedEvents);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Error deleting event');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  // Animation delay for staggered card appearance
  const getAnimationDelay = (index) => {
    return `${index * 0.1}s`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg text-gray-600 font-medium">Chargement des événements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button 
            onClick={fetchEvents}
            className="mt-4 flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Événements sportifs
        </h1>
        
        <button 
      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
      onClick={() => navigate('/add')}
    >
      <Plus className="h-5 w-5 mr-2" />
      Ajouter un événement
    </button>
      </div>

      {events.length === 0 ? (
        <div 
          className={`bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-md text-center transition-all duration-500 ease-in-out opacity-1 transform translate-y-4`}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-blue-700 text-lg">Aucun événement n'a été ajouté. Cliquez sur "Ajouter un événement" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event, index) => (
            <div 
              key={event._id} 
              className={`group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform transition-all duration-300 opacity-1 translate-y-8`}
              style={{
                transitionDelay: getAnimationDelay(index),
              }}
            >
              <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2">{event.title}</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                    <span>
                      {formatDate(event.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 text-blue-500 mr-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <button
                  className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  onClick={() => handleEditClick(event._id)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  <span>Modifier</span>
                </button>
                
                <button
                  className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  onClick={() => handleDeleteClick(event)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 w-full"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "scaleIn 0.3s ease-out forwards"
            }}
          >
            <div className="flex items-center text-red-500 mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Confirmer la suppression</h2>
            </div>
            
            <p className="mb-6 text-gray-600">
              Êtes-vous sûr de vouloir supprimer l'événement <span className="font-semibold text-gray-800">"{eventToDelete?.title}"</span> ?
              Cette action est irréversible.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300 flex items-center"
                onClick={handleDeleteCancel}
              >
                Annuler
              </button>
              
              <button
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                onClick={handleDeleteConfirm}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default EventList;