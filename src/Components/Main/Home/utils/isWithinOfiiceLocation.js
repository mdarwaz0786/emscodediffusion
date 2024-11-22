// Office location for comparison
const officeLatitude = 28.6190774;
const officeLongitude = 77.0345819;

// Convert degrees to radians
const toRadians = (degree) => degree * (Math.PI / 180);

// Calculate distance using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
};

// Check if user location is within a certain distance from the office
const isWithinOfficeLocation = (latitude, longitude, maxDistance = 20) => {
  const distance = getDistance(latitude, longitude, officeLatitude, officeLongitude);
  return distance <= maxDistance;
};

export default isWithinOfficeLocation;
