import axios from "axios";

interface GoogleMapsRouteResponse {
    routes: {
      legs: {
        start_location: { lat: number; lng: number };
        end_location: { lat: number; lng: number };
        distance: { value: number };
        duration: { text: string };
      }[];
    }[];
  }
  

export const fetchRouteDetails = async (origin: string, destination: string) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;

  try {
    const response = await axios.get<GoogleMapsRouteResponse>(url);
    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      origin: {
        latitude: leg.start_location.lat,
        longitude: leg.start_location.lng,
      },
      destination: {
        latitude: leg.end_location.lat,
        longitude: leg.end_location.lng,
      },
      distance: leg.distance.value / 1000, // Convert to km
      duration: leg.duration.text,
      routeResponse: response.data, // Original response
    };
  } catch (error) {
    throw new Error("Error fetching route details from Google Maps API");
  }
};
