import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const EventService = {
  // Récupérer tous les événements
  getAllEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  },

  // Créer un nouvel événement
  createEvent: async (eventData) => {
    try {
      const response = await axios.post(`${API_URL}/events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  },

  // Supprimer un événement
  deleteEvent: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  },

  // Bonus: Mettre à jour un événement
  updateEvent: async (id, eventData) => {
    try {
      const response = await axios.put(`${API_URL}/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw error;
    }
  },

  // Bonus: Récupérer un événement spécifique
  getEventById: async (id) => {
    try {
      const response = await axios.get(`http://localhost:10000/api/v1/events/680f949580ade19a33ff15f7`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      throw error;
    }
  }
};

export default EventService;