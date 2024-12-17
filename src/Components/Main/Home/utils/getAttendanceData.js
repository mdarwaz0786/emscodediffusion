// Get attendance data
const getAttendanceData = (team) => {
  if (!team || !team?._id) {
    return { time: null, date: null, employeeId: null };
  }

  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const time = today.toTimeString().slice(0, 5);
  const employeeId = team?._id;

  return { time, date, employeeId };
};

export default getAttendanceData;
