import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Linking,
  RefreshControl,
} from "react-native";
import FileViewer from 'react-native-file-viewer';
import Icon from "react-native-vector-icons/Feather";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import requestStoragePermission from "./utils/requestStoragePermission.js";
import getUniqueFileName from "./utils/getUniqueFileName.js";
import { useAuth } from "../../../Context/auth.context.js";
import { API_BASE_URL } from "@env";
import axios from "axios";
import numberToWord from "../../../Helper/numberToWord.js";
import getMonthName from "../../../Helper/getMonthName.js"
import formatDate from "../../../Helper/formatDate.js";
import Toast from "react-native-toast-message";
import { useRefresh } from "../../../Context/refresh.context.js";
import { ActivityIndicator } from "react-native-paper";

const SalarySlip = ({ navigation }) => {
  const { validToken, team } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [office, setOffice] = useState([]);
  const [salary, setSalary] = useState([]);
  const [employee, setEmployee] = useState("");
  const [employeeId, setEmployeeId] = useState(team?._id);

  useEffect(() => {
    if (team && validToken) {
      fetchOfficeLocation();
      fetchSalary();
      fetchEmployee();
      setEmployeeId(team?._id);
    };
  }, [team, validToken, refreshKey]);

  const generatePDF = async (m, y, t, a) => {
    const hasPermission = await requestStoragePermission();

    if (!hasPermission) {
      Alert.alert("Permission Denied", "Cannot save file without storage permission");
      return;
    };

    try {
      const [monthlyStaticData, attendanceData] = await Promise.all([
        fetchMonthlyStatistic(m, y),
        fetchAttendance(m, y),
      ]);

      await generatePDFAfterFetching(m, y, t, a, monthlyStaticData, attendanceData);
    } catch (error) {
      Alert.alert("Error", "Failed to download PDF.");
    };
  };

  const fetchOfficeLocation = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/officeLocation/all-officeLocation`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setOffice(response?.data?.officeLocation);
      };
    } catch (error) {
      console.log("Error:", error.message);
    };
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/single-team/${employeeId}`, {
        headers: {
          Authorization: validToken,
        },
      });
      if (response?.data?.success) {
        setEmployee(response?.data?.team);
      };
    } catch (error) {
      console.log("Error:", error.message);
    };
  };

  const fetchSalary = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/salary/all-salary`,
        {
          params: { employeeId },
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setSalary(response?.data?.data);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  const fetchMonthlyStatistic = async (month, year) => {
    try {
      const params = {};

      if (month && year) params.month = `${year}-${month}`;
      if (employeeId) params.employeeId = employeeId;

      const response = await axios.get(`${API_BASE_URL}/api/v1/attendance/monthly-statistic`, {
        params,
        headers: {
          Authorization: validToken,
        },
      });

      return response?.data?.success ? response?.data?.attendance : null;
    } catch (error) {
      return null;
    };
  };

  const fetchAttendance = async (month, year) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/attendance/all-attendance`, {
        headers: {
          Authorization: validToken,
        },
        params: {
          year,
          month,
          employeeId,
        },
      });

      return response?.data?.success ? response?.data?.attendance : [];
    } catch (error) {
      return [];
    };
  };

  const openPDF = async (filePath) => {
    try {
      const fileExists = await RNFS.exists(filePath);

      if (!fileExists) {
        Alert.alert("Error", "Pdf not generated");
        return;
      };

      await FileViewer.open(filePath, { type: "application/pdf" });
    } catch (error) {
      Alert.alert(
        "No PDF Viewer Found",
        "Please install a PDF viewer to open this file.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Install", onPress: () => Linking.openURL("market://details?id=com.adobe.reader") },
        ],
      );
    };
  };

  const generateCalendarHTML = async (month, year, attendanceData) => {
    if (month === "" || year === "" || attendanceData == []) {
      return;
    };

    const monthIndex = parseInt(month, 10) - 1;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay();

    const attendanceColors = {
      Present: "green",
      Absent: "red",
      Holiday: "#ffb300",
      Sunday: "blue",
      "On Leave": "purple",
      "Comp Off": "orange",
      default: "black",
    };

    let calendarHTML = `
    <h6 class="calendar-title">Attendance ${getMonthName(month)} ${year}</h6>
    <table class="calendar-table">
      <thead>
        <tr>
          <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
        </tr>
      </thead>
      <tbody>
    `;

    let day = 1;

    for (let i = 0; i < 6; i++) {
      calendarHTML += "<tr>";
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          calendarHTML += "<td></td>";
        } else if (day > daysInMonth) {
          calendarHTML += "<td></td>";
        } else {
          const dateString = `${year}-${month?.padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
          const attendance = attendanceData?.find((entry) => entry?.attendanceDate === dateString);
          const status = attendance?.status || "";
          const color = attendanceColors[status] || attendanceColors.default;

          calendarHTML += `
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center; background: #fff;">
            <div>${day}</div>
            <div style="color: ${color};">${status}</div>
          </td>
        `;
          day++;
        };
      };
      calendarHTML += "</tr>";
      if (day > daysInMonth) break;
    };

    calendarHTML += `</tbody></table>`;
    return calendarHTML;
  };

  const generatePDFAfterFetching = async (month, year, transactionId, amountPaid, monthlyStatic, attendanceData) => {
    const attendanceHTML = await generateCalendarHTML(month, year, attendanceData);

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salary Slip</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }

    .page-wrapper {
      margin: 20px;
    }

    .content {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
    }

    .salary-slip {
      padding: 20px;
      background-color: white;
    }

    .logo-section {
      margin-top: 10px;
      margin-bottom: 60px;
      width: 180px;
      height: 40px;
      object-fit: contain;
    }

    .company-details {
      margin-bottom: 20px;
    }

    .company-name {
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 20px;
    }

    .salary-title {
      margin-top: 50px;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }

    .payment-title,
    .attendance-summary-title {
      margin-top: 50px;
      font-size: 18px;
      font-weight: 600;
    }

    .salary-details {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      border: 1px solid #ddd;
      padding-left: 18px;
      padding-right: 20px;
    }

    .left-section,
    .right-section {
      width: 50%;
    }

    .right-section {
      border-left: 1px solid #ddd;
    }

    .right-section .row {
      margin-left: 15px;
    }

    .row {
      display: flex;
      margin-bottom: 10px;
    }

    .label {
      width: 40%;
      font-size: 15px;
      font-weight: 600;
      color: #222;
    }

    .value {
      width: 60%;
      font-size: 15px;
    }

    .salary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .salary-table th,
    .salary-table td {
      border: 1px solid #ddd;
      padding: 8px;
      padding-left: 15px;
      text-align: left;
      font-size: 15px;
      margin-top: 10px;
    }

    .net-pay {
      margin-top: 40px;
      border: 1px solid #ddd;
      padding: 10px;
      padding-left: 15px;
    }

    .net-pay .value {
      font-size: 15px;
      font-weight: 600;
      color: #222;
    }

    .attendance-summary {
      border: 1px solid #ddd;
      margin-top: 15px;
    }

    .attendance-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-left: 15px;
      padding-right: 15px;
    }

    .attendance-column {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .attendance-title {
      font-weight: 600;
      color: #222;
      font-size: 15px;
      margin-top: 10px;
    }

    .attendance-data {
      font-weight: normal;
      margin-top: 10px;
      font-size: 15px
    }

    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 14px;
      color: #333;
    }

    .page-break {
      page-break-after: always;
    }

    .second-page-logo {
      margin-top: 50px;
    }

    .calendar-title {
      margin-top: 50px;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }

    .calendar-table {
      width: 100%;
      border-collapse:collapse;
      margin-top: 10px;
    }

    .calendar-table th,
    .calendar-table td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }

    .calendar-table th {
      background: #ddd;
    }
  </style>
</head>

<body>
  <div class="page-wrapper">
    <div class="content">
      <div class="salary-slip">
        <img src="${office[0]?.logo}" class="logo-section" alt="logo" />
        <div class="company-details">
          <h4 class="company-name">${office[0]?.name}</h4>
          <hr />
        </div>

        <h6 class="salary-title">Salary Slip ${getMonthName(month)} ${year}</h6>
        <div class="salary-details">
          <div class="left-section">
            <div class="row" style="margin-top: 8px;">
              <div class="label">Employee Name</div>
              <div class="value">${employee?.name}</div>
            </div>
            <div class="row">
              <div class="label">Designation</div>
              <div class="value">${employee?.designation?.name}</div>
            </div>
            <div class="row">
              <div class="label">Department</div>
              <div class="value">${employee?.department?.name || "IT"}</div>
            </div>
            <div class="row">
              <div class="label">Date of Joining</div>
              <div class="value">${formatDate(employee?.joining)}</div>
            </div>
            <div class="row">
              <div class="label">Phone Number</div>
              <div class="value">${employee?.mobile}</div>
            </div>
          </div>

          <div class="right-section">
            <div class="row" style="margin-top: 8px;">
              <div class="label">Transaction Id</div>
              <div class="value">${transactionId}</div>
            </div>
            <div class="row">
              <div class="label">Employee ID</div>
              <div class="value">${employee?.employeeId}</div>
            </div>
            <div class="row">
              <div class="label">Monthly Gross</div>
              <div class="value">${employee?.monthlySalary}</div>
            </div>
          </div>
        </div>

        <h6 class="payment-title">Payment & Salary ${getMonthName(month)} ${year}</h6>
        <table class="salary-table">
          <thead>
            <tr>
              <th>Earnings</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Salary</td>
              <td>₹${amountPaid}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Total Earnings</th>
              <th>₹${amountPaid}</th>
            </tr>
          </tfoot>
        </table>

        <div class="net-pay">
          <div class="row">
            <div class="label">Net Payable (Total Earnings)</div>
            <div class="value">₹${amountPaid}</div>
          </div>
          <div class="row">
            <div class="label">Amount in Words</div>
            <div class="value">${numberToWord(amountPaid)}</div>
          </div>
        </div>

        <h6 class="attendance-summary-title">Attendance Summary ${getMonthName(month)} ${year}</h6>
        <div class="attendance-summary">
          <div class="attendance-row">
            <div class="attendance-column">
              <div class="attendance-title">Present</div>
              <div class="attendance-data">${monthlyStatic?.employeePresentDays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Absent</div>
              <div class="attendance-data">${monthlyStatic?.employeeAbsentDays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Leave</div>
              <div class="attendance-data">${monthlyStatic?.employeeLeaveDays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Comp Off</div>
              <div class="attendance-data">${monthlyStatic?.employeeCompOffDays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Weekly Off</div>
              <div class="attendance-data">${monthlyStatic?.totalSundays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Holiday</div>
              <div class="attendance-data">${monthlyStatic?.totalHolidays}</div>
            </div>
          </div>
        </div>

        <p class="footer">This is a digitally generated document and does not require a signature or seal.</p>

        <div class="page-break"></div>

        <img src="${office[0]?.logo}" class="logo-section second-page-logo" alt="logo" />

        <div class="company-details">
          <h4 class="company-name">${office[0]?.name}</h4>
          <hr />
        </div>

        <!-- Attendance table with summary -->
        ${attendanceHTML}

        <h6 class="attendance-summary-title">Attendance Summary ${getMonthName(month)} ${year}</h6>
        <div class="attendance-summary">
          <div class="attendance-row">
            <div class="attendance-column">
              <div class="attendance-title">Present</div>
              <div class="attendance-data">${monthlyStatic?.employeePresentDays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Absent</div>
              <div class="attendance-data">${monthlyStatic?.employeeAbsentDays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Leave</div>
              <div class="attendance-data">${monthlyStatic?.employeeLeaveDays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Comp Off</div>
              <div class="attendance-data">${monthlyStatic?.employeeCompOffDays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Weekly Off</div>
              <div class="attendance-data">${monthlyStatic?.totalSundays}</div>
            </div>
            <div class="attendance-column">
              <div class="attendance-title">Holiday</div>
              <div class="attendance-data">${monthlyStatic?.totalHolidays}</div>
            </div>
          </div>
        </div>

        <p class="footer">This is a digitally generated document and does not require a signature or seal.</p>
      </div>
    </div>
  </div>
 </body>

</html>`;

    const fileNameBase = `${getMonthName(month)}-${year}-${employee?.name}-salary-slip`;
    const directory = RNFS.DownloadDirectoryPath;

    try {
      // Ensure Downloads folder exists
      if (!await RNFS.exists(directory)) {
        await RNFS.mkdir(directory);
      };

      // Generate the PDF
      const pdfOptions = {
        html: html,
        fileName: fileNameBase,
        directory: 'Download',
      };

      const pdf = await RNHTMLtoPDF.convert(pdfOptions);

      // Generate a unique file name
      const uniqueFileName = await getUniqueFileName(directory, fileNameBase, 'pdf');
      const newPath = `${directory}/${uniqueFileName}`;

      // Move the PDF to the Downloads directory
      await RNFS.moveFile(pdf.filePath, newPath);

      // Notify the media scanner about the new file
      await RNFetchBlob.fs.scanFile([{ path: newPath, mime: 'application/pdf' }]);
      Toast.show({ type: "success", text1: "Slip Downloaded", text2: `Slip saved at: ${newPath}` });

      setTimeout(() => {
        openPDF(newPath);
      }, 3000)
    } catch (error) {
      Alert.alert("Error", "Download Failed");
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  return (
    <>
      <View style={styles.header}>
        <Icon name="arrow-left" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Salary Slip</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {
          loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="small" color="#ffb300" />
            </View>
          ) : salary?.length === 0 ? (
            <Text style={{ flex: 1, textAlign: "center", color: "#777" }}>
              No salary slip found.
            </Text>
          ) : (
            salary?.map((item, index) => (
              <View key={index} style={styles.container}>
                <Text style={styles.monthText}>{getMonthName(item?.month)}</Text>
                <Text style={styles.yearText}>{item?.year}</Text>
                <TouchableOpacity
                  onPress={() => generatePDF(item?.month, item?.year, item?.transactionId, item?.amountPaid)}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Download</Text>
                </TouchableOpacity>
              </View>
            ))
          )
        }
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  scrollContainer: {
    padding: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
  },
  monthText: {
    fontSize: 14,
    color: "#555",
  },
  yearText: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#ffb300",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 14,
  },
});

export default SalarySlip;
