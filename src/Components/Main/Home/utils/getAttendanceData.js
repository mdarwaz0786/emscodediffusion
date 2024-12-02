// Get attendance data
const getAttendanceData = team => {
  const time = new Date().toTimeString().split(" ")[0].slice(0, 5);
  const date = new Date().toISOString().split("T")[0];
  const employeeId = team?._id;

  return { time, date, employeeId };
};

export default getAttendanceData;
