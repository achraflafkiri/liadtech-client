import React, { useState, useEffect, useTransition } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import EventService from '../services/EventService';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventService.getAllEvents();
      console.log("API response:", response);
      
      // Handle different response formats
      if (response.data && response.data.event) {
        // Single event response format
        setEvents([response.data.event]);
      } else if (response.data && Array.isArray(response.data.events)) {
        // Multiple events in an array
        setEvents(response.data.events);
      } else if (Array.isArray(response)) {
        // Direct array response
        setEvents(response);
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // Object with multiple events as properties
        const eventsArray = Object.values(response.data);
        setEvents(eventsArray);
      } else {
        // Fallback - try to make it work with whatever we got
        console.warn("Unexpected API response format:", response);
        setEvents(Array.isArray(response) ? response : []);
      }
      
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => {
    startTransition(() => {
      navigate(`/edit/${id}`);
    });
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await EventService.deleteEvent(eventToDelete._id);
      setEvents(events.filter(event => event._id !== eventToDelete._id));
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'événement');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4" role="alert">
        <p>{error}</p>
        <button 
          onClick={fetchEvents}
          className="mt-2 text-red-700 hover:text-red-900 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Liste des événements sportifs</h1>

      {events.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p>Aucun événement n'a été ajouté. Cliquez sur "Ajouter un événement" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="card bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Date:</span> {format(new Date(event.date), 'dd MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Lieu:</span> {event.location}
                </p>
              </div>
              <div className="px-5 py-3 bg-gray-50 flex justify-between">
                <button
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={() => handleEditClick(event._id)}
                  disabled={isPending}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Modifier
                </button>
                <button
                  className="text-red-600 hover:text-red-800 flex items-center"
                  onClick={() => handleDeleteClick(event)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer l'événement "{eventToDelete?.title}" ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                onClick={handleDeleteCancel}
              >
                Annuler
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
                onClick={handleDeleteConfirm}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;