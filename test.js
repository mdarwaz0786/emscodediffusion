import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";
import requestStoragePermission from "./utils/requestStoragePermission.js";
import getUniqueFileName from "./utils/getUniqueFileName.js";
import { useAuth } from "../../../Context/auth.context.js";
import { API_BASE_URL } from "@env";
import axios from "axios";

const SalarySlip = () => {
  const { validToken } = useAuth();
  const [office, setOffice] = useState([]);

  const fetchOfficeLocation = async () => {
    try {
      const response = await axios.get(
        ` ${API_BASE_URL}/api/v1/officeLocation/all - officeLocation`,
        {
          headers: {
            Authorization: validToken,
          },
        }
      );

      if (response?.data?.success) {
        setOffice(response?.data?.officeLocation);
      }
    } catch (error) {
      console.log("Error while fetching office location:", error.message);
    }
  };

  useEffect(() => {
    fetchOfficeLocation();
  }, []);

  const generateCalendarHTML = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let calendarHTML = `
      <h6 class="calendar-title">Calendar (${now.toLocaleString("default", { month: "long" })} ${year})</h6>
      <table class="calendar-table">
        <thead>
          <tr>
            <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
          </tr>
        </thead>
        <tbody>
    `;

    let firstDay = new Date(year, month, 1).getDay();
    let day = 1;
    for (let i = 0; i < 6; i++) {
      calendarHTML += "<tr>";
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          calendarHTML += "<td></td>";
        } else if (day > daysInMonth) {
          calendarHTML += "<td></td>";
        } else {
          calendarHTML += <td>${day}</td>;
          day++;
        }
      }
      calendarHTML += "</tr>";
      if (day > daysInMonth) break;
    }

    calendarHTML += `</tbody ></table >`;
    return calendarHTML;
  };

  const generatePDF = async () => {
    const hasPermission = await requestStoragePermission();

    if (!hasPermission) {
      Alert.alert("Permission Denied", "Cannot save file without storage permission");
      return;
    }

    const calendarHTML = generateCalendarHTML();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salary Slip</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .page-wrapper { margin: 20px; }
    .content { background-color: #fff; padding: 20px; border-radius: 5px; }
    .salary-slip { padding: 20px; background-color: white; }
    .company-details { margin-bottom: 20px; }
    .company-name { font-weight: 600; font-size: 20px; margin-bottom: 20px; }
    .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #333; }
    .calendar-title { margin-top: 50px; font-size: 18px; font-weight: 600; text-align: center; }
    .calendar-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .calendar-table th, .calendar-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }
  </style>
</head>
<body>
  <div class="page-wrapper">
    <div class="content">
      <div class="salary-slip">
        <h4 class="company-name">${office[0]?.name}</h4>
        <hr />
        <h6>Salary Slip (January 2025)</h6>
        <p>Employee Name: John Doe</p>
        <p>Designation: Software Engineer</p>
        <p>Department: IT</p>
        <p>Monthly Gross: ₹50,000</p>
        <p>Net Payable: ₹50,000</p>
      </div>
      
      <p class="footer">This is a digitally generated document and does not require a signature or seal.</p>
      
      <!-- Dynamic Calendar -->
      ${calendarHTML}
    </div>
  </div>
</body>
</html>`;

    const fileNameBase = "salary";
    const directory = RNFS.DownloadDirectoryPath;

    try {
      if (!await RNFS.exists(directory)) {
        await RNFS.mkdir(directory);
      }

      const pdfOptions = {
        html: html,
        fileName: fileNameBase,
        directory: "Download",
      };

      const pdf = await RNHTMLtoPDF.convert(pdfOptions);
      const uniqueFileName = await getUniqueFileName(directory, fileNameBase, "pdf");
      const newPath = `${directory}/${uniqueFileName}`;

      await RNFS.moveFile(pdf.filePath, newPath);
      await RNFetchBlob.fs.scanFile([{ path: newPath, mime: "application/pdf" }]);

      Alert.alert("PDF Generated", `File saved to: ${newPath}`);
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Icon name="arrow-left" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Salary Slip</Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={generatePDF} style={styles.button}>
          <Text style={styles.buttonText}>Generate PDF</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: "row", padding: 12, backgroundColor: "#fff" },
  headerTitle: { fontSize: 16, fontWeight: "400", color: "#000" },
  button: { padding: 10, backgroundColor: "blue", marginBottom: 10 },
  buttonText: { color: "white" },
});

export default SalarySlip;