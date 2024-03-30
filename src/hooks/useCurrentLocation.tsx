import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";

interface UseCurrentLocationReturn {
  location: LocationObject | null;
  errorMsg: string | null;
}

export const useCurrentLocation = (): UseCurrentLocationReturn => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  return { location, errorMsg };
};
