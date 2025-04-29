import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Tag, CheckCircle, XCircle, ArrowLeft, Loader, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import EventService from '../services/EventService';

const EditEvent = () => {
  const { id } = useParams();

  // console.log("id: ", id);

  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // fetch the event data
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await EventService.getEventById(id);
        
        // console.log("response: ", response);        

        // Extract the event data from the response structure
        const event = response.data.event;
        
        setTitle(event.title);
        
        // Format the date for the date input
        setDate(format(new Date(event.date), 'yyyy-MM-dd'));
        setLocation(event.location);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'événement:', error);
        setErrorMessage('Impossible de charger les détails de l\'événement');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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
    
    return Object.keys(newErrors).length === 0; // return true or false
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      await EventService.updateEvent(id, {
        title,
        date: new Date(date),
        location
      });
      
      setSuccessMessage('Événement mis à jour avec succès !');
      setTimeout(() => {
        navigate('/');
      }, 1500); // navigate to home page after 1500 ms
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      setErrorMessage('Erreur lors de la mise à jour de l\'événement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigating to home page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div 
        className="transition-all duration-500 ease-in-out transform"
      >
        <div className="flex items-center mb-8">
          <button
            onClick={handleCancel}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            disabled={submitting}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Modifier l'événement
          </h1>
        </div>
        
        {successMessage && (
          <div 
            className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 shadow-sm flex items-start"
            role="alert"
          >
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div 
            className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 shadow-sm flex items-start"
            role="alert"
          >
            <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="form-group">
                <label 
                  className="flex items-center text-gray-700 font-medium mb-2" 
                  htmlFor="title"
                >
                  <Tag className="h-5 w-5 text-blue-500 mr-2" />
                  Titre de l'événement
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Tournoi de football"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 ml-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label 
                  className="flex items-center text-gray-700 font-medium mb-2" 
                  htmlFor="date"
                >
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  Date de l'événement
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1 ml-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.date}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label 
                  className="flex items-center text-gray-700 font-medium mb-2" 
                  htmlFor="location"
                >
                  <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                  Lieu de l'événement
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Stade municipal"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1 ml-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button 
                type="button"
                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center font-medium"
                onClick={handleCancel}
                disabled={submitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Annuler
              </button>
              
              <button 
                type="submit"
                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center ${
                  (submitting) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;