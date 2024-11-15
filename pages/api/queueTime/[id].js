import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query; // Extrahiere die ID aus der URL

  if (!id) {
    return res.status(400).json({ error: 'Missing ID parameter in request.' });
  }

  try {
    // Dynamische URL aufrufen
    const response = await axios.get(`https://queue-times.com/parks/${id}/queue_times.json`);
    
    // Erfolgreiche Antwort weiterleiten
    res.status(200).json(response.data);
  } catch (error) {
    // Fehler abfangen und melden
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || `Failed to fetch data for ID ${id}.`;

    console.error('Error fetching queue times:', error.message);
    res.status(statusCode).json({ error: errorMessage });
  }
}