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
    // Fetch data from the main API
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

    // Flatten parks from companies
    const companies = response.data;
    const allParks = companies.flatMap((company) => company.parks);

    // Fetch detailed data for each park and check if it's open
    const parksWithOpenStatus = await Promise.all(
      allParks.map(async (park) => {
        try {
          const detailsUrl = `https://queue-times.com/parks/${park.id}/queue_times.json`;
          const parkDetailsResponse = await axios.get(detailsUrl, {
            timeout: 5000,
            headers: {
              'User-Agent': 'Next.js Server',
            },
          });

          const parkDetails = parkDetailsResponse.data;

          // Check if any ride is open
          const isOpen = parkDetails.lands.flatMap((land) => land.rides).some((ride) => ride.is_open);

          return { ...park, isOpen };
        } catch (err) {
          console.error(`Error fetching details for park ID ${park.id}:`, err.message);
          return { ...park, isOpen: false }; // Assume closed if fetching details fails
        }
      })
    );

    // Store in cache
    cache = parksWithOpenStatus;
    lastFetchTime = Date.now();

    // Respond with all parks and their status
    res.status(200).json(parksWithOpenStatus);
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