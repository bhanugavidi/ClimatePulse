import { useState } from 'react';

export interface LocationState {
  lat: number;
  lng: number;
  accuracy: number;
}

export function useCurrentLocation() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = (onSuccess?: (loc: LocationState) => void) => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(loc);
        setLoading(false);
        if (onSuccess) {
          onSuccess(loc);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case 1: // PERMISSION_DENIED
            setError("Location permission was denied. Please allow location access in your browser settings.");
            break;
          case 2: // POSITION_UNAVAILABLE
            setError("Your location could not be detected. Please check your device location services.");
            break;
          case 3: // TIMEOUT
            setError("Location request timed out. Please try again.");
            break;
          default:
            setError("An unknown error occurred while detecting location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const clearError = () => setError(null);

  return { location, loading, error, getCurrentLocation, setLocation, clearError };
}
