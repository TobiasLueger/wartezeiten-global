import axios from 'axios';

// Cache setup for better performance
let cache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // Cache for 5 minutes

export default async function handler(req, res) {
  // Restrict HTTP methods (optional)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Fetch from cache if data is still valid
  if (cache && Date.now() - lastFetchTime < CACHE_DURATION) {
    return res.status(200).json(cache);
  }

  try {
    // Fetch data from API
    const apiUrl = "https://queue-times.com/parks.json";
    if (!apiUrl) {
      throw new Error('API URL is not configured. Please check your environment variables.');
    }

    const response = await axios.get(apiUrl, {
      timeout: 5000, // Set timeout to 5 seconds
      headers: {
        'User-Agent': 'Next.js Server',
      },
    });

    // Store in cache
    cache = response.data;
    lastFetchTime = Date.now();

    // Respond with data
    res.status(200).json(cache);
  } catch (error) {
    // Gracefully handle errors
    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message ||
      'An error occurred while fetching data. Please try again later.';

    console.error('Error fetching data:', error.message);

    res.status(statusCode).json({ error: errorMessage });
  }
}