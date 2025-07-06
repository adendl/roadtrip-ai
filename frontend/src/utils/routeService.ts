interface RouteCoordinates {
  latitude: number;
  longitude: number;
}

interface GraphHopperResponse {
  paths: Array<{
    points: {
      coordinates: number[][];
    };
  }>;
}

interface OSRMResponse {
  routes: Array<{
    geometry: {
      coordinates: number[][];
    };
  }>;
}

export const fetchDrivingRoute = async (
  start: RouteCoordinates,
  end: RouteCoordinates
): Promise<[number, number][]> => {
  try {
    // Try GraphHopper API first (free tier: 10,000 requests/month)
    const graphHopperKey = 'demo'; // Replace with your key from https://graphhopper.com/dashboard/
    const graphHopperUrl = `https://graphhopper.com/api/1/route?point=${start.latitude},${start.longitude}&point=${end.latitude},${end.longitude}&vehicle=car&key=${graphHopperKey}`;
    
    const response = await fetch(graphHopperUrl);
    
    if (response.ok) {
      const data: GraphHopperResponse = await response.json();
      
      if (data.paths && data.paths.length > 0) {
        // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
        return data.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]);
      }
    }
    
    // Fallback to OSRM (completely free, no API key needed)
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
    
    const osrmResponse = await fetch(osrmUrl);
    
    if (osrmResponse.ok) {
      const osrmData: OSRMResponse = await osrmResponse.json();
      
      if (osrmData.routes && osrmData.routes.length > 0) {
        // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
        return osrmData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      }
    }
    
    throw new Error('No route found from either service');
  } catch (error) {
    console.error('Error fetching route:', error);
    // Fallback to straight line if both APIs fail
    return [
      [start.latitude, start.longitude],
      [end.latitude, end.longitude]
    ];
  }
}; 