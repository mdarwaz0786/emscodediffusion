// Office location for comparison
const officeLatitude = 28.6190774;
const officeLongitude = 77.0345819;

// Helper function to check if user location matches office location
const isWithinOfficeLocation = (latitude, longitude) => {
  const userLat = Math.floor(latitude * 100) / 100;
  const userLong = Math.floor(longitude * 100) / 100;
  const officeLat = Math.floor(officeLatitude * 100) / 100;
  const officeLong = Math.floor(officeLongitude * 100) / 100;
  return userLat === officeLat && userLong === officeLong;
};

export default isWithinOfficeLocation;