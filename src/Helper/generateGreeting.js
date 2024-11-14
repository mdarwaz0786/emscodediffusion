// Function to get greeting based on the current hour
const getGreeting = () => {
  // Get current hour
  const currentHour = new Date().getHours();

  // Determine the greeting based on the time of day
  if (currentHour >= 6 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

export default getGreeting;
