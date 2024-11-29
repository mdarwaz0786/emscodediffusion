import axios from "axios";
import {API_BASE_URL} from "@env";

// Convert degrees to radians
const toRadians = degree => degree * (Math.PI / 180);

// Calculate distance using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon1 - lon2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
};

// Fetch office latitude and longitude dynamically and check proximity
const isWithinOfficeLocation = async (
  userLatitude,
  userLongitude,
  validToken,
  maxDistance = 20,
) => {
  try {
    // Fetch office locations from the API
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/officeLocation/all-officeLocation`,
      {
        headers: {
          Authorization: validToken,
        },
      },
    );

    if (response?.data?.success) {
      const officeLocations = response?.data?.officeLocation;

      // Check if user is within range of any office
      return officeLocations.some(({latitude, longitude}) => {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lon)) {
          console.warn("Invalid latitude or longitude:", latitude, longitude);
          return false;
        }

        const distance = getDistance(userLatitude, userLongitude, lat, lon);
        return distance <= maxDistance;
      });
    } else {
      throw new Error("Failed to fetch office locations.");
    }
  } catch (error) {
    console.error(
      "Error while fetching office locations or calculating proximity:",
      error.message,
    );
    return false;
  }
};

export default isWithinOfficeLocation;
