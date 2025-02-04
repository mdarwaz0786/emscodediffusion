import axios from "axios";
import { API_BASE_URL } from "@env";

// Convert degree to radian
const toRadians = (degree) => {
  return degree * (Math.PI / 180);
};

// Calculate distance using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometer
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon1 - lon2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meter
};

// Fetch office latitude and longitude and check proximity
const isWithinOfficeLocation = async (userLatitude, userLongitude, validToken, team) => {
  const officeId = team?.office?._id;

  if (!officeId) {
    return false;
  };

  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/v1/officeLocation/single-officeLocation/${officeId}`, {
      headers: { Authorization: validToken },
    });

    if (!data?.success || !data?.officeLocation) {
      throw new Error("Failed to fetch office location.");
    };

    const { latitude, longitude, attendanceRadius } = data?.officeLocation;

    if (!latitude || !longitude || !attendanceRadius) {
      throw new Error("Invalid office location data.");
    };

    const distance = getDistance(userLatitude, userLongitude, parseFloat(latitude), parseFloat(longitude));

    return distance <= parseFloat(attendanceRadius);
  } catch (error) {
    console.log("Error while fetching office location:", error.message);
    return false;
  };
};

export default isWithinOfficeLocation;
