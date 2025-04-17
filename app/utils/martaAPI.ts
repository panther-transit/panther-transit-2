import * as gtfs from 'gtfs-realtime-bindings';

// Define the type for a bus position
export interface BusPosition {
  id: string;
  latitude: number;
  longitude: number;
  route: string;
}

// Configuration for Mobility Database API
const MOBILITY_DB_TOKEN_URL = 'https://api.mobilitydatabase.org/v1/tokens/access';
const MOBILITY_DB_REALTIME_URL = 'https://api.mobilitydatabase.org/v1/gtfs_rt_feeds';
const REFRESH_TOKEN = 'AMf-vBzacP-8jBZeFsWwz2rUXayBlrV9m4zSjE1hFo1n9F4rCIXVen-di2TT5KEQiCF9ZdZMzpSR9VZV4lDDp9VfSZPESgdiM4WU362r1Q7CW_5qGfHqFTuKqbql89MCoHwyaPgayzpWaPdwPlvobAnRm1nr7nocHT_P0JhtmWNvyaTSwk2Vcq7HFKNwc_4APAasr3zexh2W68AOtpvpL574a9yG9Jxf2uXmUMgyJ7RIjVAvITDS-nOEh39RhUHJLtO9KdB0wHaX2OqzzJBfgUKsvnF0iYQBXBdVL2XTRmTtaE_O71fVMNYgKhST35Nn-Ra3ViM2-_1f3ccZ4ypJ4Iyvkoa-nbkLBw';
const MARTA_FEED_ID = 'mdb-1601'; // MARTA's feed ID from Mobility Database

// Store the access token and its expiration
let accessToken: string | null = null;
let tokenExpiration: number | null = null;

// Map to store route IDs and their assigned random numbers
const routeIdToRandomNumberMap = new Map<string, number>();

// Function to generate a random integer (adjust range as needed)
const generateRandomNumber = (): number => {
  // Generate a random integer between 1 and 900
  return Math.floor(Math.random() * 900) + 1;
};

// Function to get a valid access token
const getAccessToken = async (): Promise<string> => {
  const currentTime = Date.now();
  
  // If we have a valid token, return it
  if (accessToken && tokenExpiration && tokenExpiration > currentTime) {
    return accessToken;
  }
  
  // Otherwise, get a new token
  try {
    const response = await fetch(MOBILITY_DB_TOKEN_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID!}:${process.env.CLIENT_SECRET!}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Make sure we received a token
    if (!data.access_token) {
      throw new Error('No access token received from API');
    }
    
    accessToken = data.access_token;
    
    // Set expiration time (tokens are valid for 1 hour = 3600 seconds)
    // Subtract 5 minutes (300 seconds) to be safe
    tokenExpiration = currentTime + ((data.expires_in || 3600) - 300) * 1000;
    
    return accessToken!;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export const fetchMartaBusData = async (): Promise<BusPosition[]> => {
  try {
    // Fetch GTFS-RT data directly from MARTA's feed URL
    const response = await fetch('https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb');
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const feed = gtfs.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    const buses: BusPosition[] = feed.entity
      .filter(entity => entity.vehicle && entity.vehicle.position && entity.vehicle.trip?.routeId) // Ensure routeId exists
      .map(entity => {
        const routeId = entity.vehicle!.trip!.routeId!; // Assert non-null based on filter

        // Check if routeId is already in the map, if not, add it with a random number
        if (!routeIdToRandomNumberMap.has(routeId)) {
          const randomNumber = generateRandomNumber();
          routeIdToRandomNumberMap.set(routeId, randomNumber);
          console.log(`Assigned random number ${randomNumber} to route ${routeId}`); // Optional logging
        }

        return {
          id: entity.id || 'Unknown',
          latitude: entity.vehicle!.position!.latitude ?? 0,
          longitude: entity.vehicle!.position!.longitude ?? 0,
          route: routeId,
        };
      });

    return buses;
  } catch (error) {
    console.error('Error fetching MARTA bus data:', error);
    return []; // Return empty array on error to prevent crashes downstream
  }
};

// Function to get the current state of the route ID map
export const getRouteIdMap = (): Map<string, number> => {
  return routeIdToRandomNumberMap;
};

export const testMartaApiConnection = async (): Promise<void> => {
  console.log('Testing MARTA API connection...');
  
  try {
    // Test token retrieval
    console.log('Attempting to get access token...');
    const token = await getAccessToken();
    console.log('✅ Successfully retrieved access token');
    
    // Test data retrieval
    console.log('Attempting to fetch MARTA bus data...');
    const busData = await fetchMartaBusData();
    
    if (busData.length === 0) {
      console.log('⚠️ Retrieved 0 buses. This might be expected if no buses are currently running, or could indicate an issue.');
    } else {
      console.log(`✅ Successfully retrieved data for ${busData.length} buses`);
      
      // Print sample data
      console.log('Sample bus data (first 3 entries):');
      busData.slice(0, 3).forEach((bus, index) => {
        console.log(`Bus ${index + 1}:`, JSON.stringify(bus, null, 2));
      });
      
      // Log some stats
      const routes = new Set(busData.map(bus => bus.route));
      console.log(`Total unique routes: ${routes.size}`);
      console.log('Routes:', Array.from(routes).join(', '));
    }
    
    console.log('API test completed successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ API test failed:', error);
    throw error;
  }
};