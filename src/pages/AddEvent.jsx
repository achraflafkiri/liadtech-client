import React, { useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import EventService from '../services/EventService';

const AddEvent = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }
    
    if (!date) {
      newErrors.date = 'La date est obligatoire';
    }
    
    if (!location.trim()) {
      newErrors.location = 'Le lieu est obligatoire';
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await EventService.createEvent({
        title,
        date: new Date(date),
        location
      });

      console.log("res : ", res);
      
      setSuccessMessage('Événement ajouté avec succès !');
      
      // Use transition for navigation to improve user experience
      startTransition(() => {
        setTimeout(() => {
          navigate('/');
        }, 1500);
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      setErrorMessage('Erreur lors de l\'ajout de l\'événement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    startTransition(() => {
      navigate('/');
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ajouter un événement</h1>
      
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="title">
              Titre de l'événement
            </label>
            <input
              type="text"
              id="title"
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Tournoi de football"
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>
          
          <div className="mb-4">
            <label className="form-label" htmlFor="date">
              Date de l'événement
            </label>
            <input
              type="date"
              id="date"
              className={`form-input ${errors.date ? 'border-red-500' : ''}`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </div>
          
          <div className="mb-6">
            <label className="form-label" htmlFor="location">
              Lieu de l'événement
            </label>
            <input
              type="text"
              id="location"
              className={`form-input ${errors.location ? 'border-red-500' : ''}`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Stade municipal"
            />
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Annuler
            </button>
            <button 
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ${(submitting || isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={submitting || isPending}
            >
              {submitting ? 'Enregistrement...' : 'Ajouter l\'événement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;