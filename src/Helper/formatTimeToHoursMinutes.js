// Helper function to format time 08:30 as "08 hours 30 minutes"
const formatTimeToHoursMinutes = timeString => {
  if (!timeString) return ""; // Return empty if time is not provided
  const [hours, minutes] = timeString.split(":").map(Number); // Split hours and minutes
  return `${hours} hours ${minutes} minutes`;
};

export default formatTimeToHoursMinutes;
