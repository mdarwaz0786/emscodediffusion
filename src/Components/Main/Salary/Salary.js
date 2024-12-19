import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFetchBlob from "rn-fetch-blob";
import requestStoragePermission from "./utils/requestStoragePermission.js";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import getMonthName from "./utils/getMonthName.js";

const SalarySlip = ({ route }) => {
  const id = route?.params?.id;
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [monthlySalary, setMonthlySalary] = useState("");
  const [office, setOffice] = useState([]);
  const [employee, setEmployee] = useState("");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [employeeId, setEmployeeId] = useState(id);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestStoragePermission();
  }, []);

  // Update employeeId, month and date when the component mounts
  useEffect(() => {
    setEmployeeId(id);
    fetchSingleEmployee(id);
    setMonth(currentMonth);
    setYear(currentYear);
  }, [id]);

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
      }
    } catch (error) {
      console.log("Error while fetching office location:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (validToken) {
      fetchOfficeLocation();
    }
  }, [validToken, refreshKey]);

  // Fetch single employee
  const fetchSingleEmployee = async id => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/team/single-team/${id}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setEmployee(response?.data?.team);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  // Get current month salary for employee
  const fetchMonthlySalary = async () => {
    try {
      setLoading(true);
      const params = {};

      if (month) {
        const formattedMonth = month.toString().padStart(2, "0");
        params.month = `${year}-${formattedMonth}`;
      }

      if (employeeId) {
        params.employeeId = employeeId;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/salary/monthly-salary`,
        {
          params,
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setMonthlySalary(response?.data?.salary);
      } else {
        setMonthlySalary("");
      }
    } catch (error) {
      console.log("Error while fetching monthly salary:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (employeeId && month && year && validToken) {
      fetchMonthlySalary();
    }
  }, [employeeId, month, year, validToken, refreshKey]);

  // Function to reset filters to initial values
  const resetFilters = () => {
    setMonth(currentMonth);
    setYear(currentYear);
    setEmployeeId(id);
    fetchSingleEmployee(id);
    fetchMonthlySalary();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const generatePDF = async () => {
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
      background-color: #f5f5f5;
      width: 70vw;
      margin: 0 auto;
    }

    .scrollViewContent {
      padding: 20px;
    }

    .salarySlip {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e1e1e1;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    .companyLogo img {
      width: 140px;
      height: 70px;
      object-fit: contain;
    }

    .companyInfo {
      padding-top: 10px,
    }

    .companyName {
      font-size: 16px;
      color: #333;
      font-weight: 500;
      padding-bottom: 20px,
    }

    .companyAddress {
      font-size: 15px;
      color: #777;
    }

    .employeeInfo {
      margin-bottom: 20px;
    }

    .salaryMonth {
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: 500;
      text-align: center;
      color: #333;
    }

    .employeeDetail {
      font-size: 14px;
      color: #555;
      margin-bottom: 5px;
    }

    .bold {
      font-weight: 500;
    }

    .salaryDetails {
      margin-bottom: 20px;
    }

    .detailsHeader {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e1e1e1;
      padding-bottom: 5px;
    }

    .headerText {
      font-size: 14px;
      font-weight: 500;
    }

    .salaryRow {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e1e1e1;
    }

    .salaryText {
      font-size: 14px;
      color: #333;
    }

    .totalSalary {
      font-weight: 400;
      background-color: #f9f9f9;
      padding: 8px 0;
    }

    .salaryTextBold {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .footer {
      text-align: right;
      margin-top: 50px;
    }

    .footerText {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  </style>
</head>

<body>
  <div class="scrollViewContent">
    <div class="salarySlip">
      <!-- Company Header -->
      <div class="header">
        <div class="companyLogo">
          <img src="${office[0]?.logo}" alt="company-logo">
        </div>
        <div class="companyInfo">
          <div class="companyName">${office[0]?.name}</div>
          <div class="companyAddress">${office[0]?.addressLine1}</div>
          <div class="companyAddress">${office[0]?.addressLine3}</div>
          <div class="companyAddress">${office[0]?.addressLine3}</div>
        </div>
      </div>

      <!-- Employee Information -->
      <div class="employeeInfo">
        <div class="salaryMonth">${getMonthName(month)} ${year}</div>
        <div class="employeeDetail"><span class="bold">Employee Name:</span>  ${employee?.name
      }</div>
        <div class="employeeDetail"><span class="bold">Designation:</span> ${employee?.designation?.name
      }</div>
        <div class="employeeDetail"><span class="bold">Employee ID:</span> ${employee?.employeeId
      }</div>
        <div class="employeeDetail"><span class="bold">Department:</span> IT</div>
        <div class="employeeDetail"><span class="bold">Bank Account:</span> XXXX-XXXX-XXXX-XXXX</div>
      </div>

      <!-- Salary Details -->
      <div class="salaryDetails">
        <div class="detailsHeader">
          <div class="headerText">Particulars</div>
          <div class="headerText">Amount</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Basic Salary</div>
          <div class="salaryText">₹${employee?.monthlySalary}</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">House Rent Allowance (HRA)</div>
          <div class="salaryText">₹0.00</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Special Allowance</div>
          <div class="salaryText">₹0.00</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Bonus</div>
          <div class="salaryText">₹0.00</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Provident Fund (PF)</div>
          <div class="salaryText">-₹0.00</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Income Tax</div>
          <div class="salaryText">-₹0.00</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Deduction</div>
          <div class="salaryText">-₹${monthlySalary?.totalDeduction}</div>
        </div>
        <div class="salaryRow totalSalary">
          <div class="salaryTextBold">Total Salary</div>
          <div class="salaryTextBold">₹${monthlySalary?.totalSalary}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footerText">Signature</div>
      </div>
    </div>
  </div>
</body>

</html>`;

    let options = {
      html: html,
      fileName: `Salary-${getMonthName(month)?.slice(0, 3)}-${year}-${employee?.name?.split(" ", 1)[0]
        }`,
      directory: "Downloads", // Ensure this is set to 'Downloads'
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const newPath = await `${RNFetchBlob.fs.dirs.DownloadDir
        }/Salary-${getMonthName(month)?.slice(0, 3)}-${year}-${employee?.name?.split(" ", 1)[0]
        }.pdf`; // Set the new path
      await RNFetchBlob.fs.mv(file.filePath, newPath); // Move the file to the new path
      Alert.alert("PDF Generated", `File saved to: ${newPath}`);
      console.log("PDF saved successfully at:", newPath);
    } catch (error) {
      console.log("Error while generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Salary</Text>
        <TouchableOpacity style={styles.buttonReset} onPress={resetFilters}>
          <Text style={styles.buttonResetText}>Reset Filter</Text>
        </TouchableOpacity>
      </View>

      {
        loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {/* Filter Section */}
            <View style={styles.filterContainer}>
              <View style={styles.pickerRow}>
                {/* Year Picker */}
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={year}
                    onValueChange={itemValue => setYear(itemValue)}
                    style={styles.picker}>
                    {Array.from({ length: 12 }, (_, index) => {
                      const yearOption = currentYear - index;
                      return (
                        <Picker.Item
                          key={yearOption}
                          label={String(yearOption)}
                          value={yearOption}
                          style={styles.pickerItem}
                        />
                      );
                    })}
                  </Picker>
                </View>

                {/* Month Picker */}
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={month}
                    onValueChange={itemValue => setMonth(itemValue)}
                    style={styles.picker}
                  >
                    {monthNames?.map((month, index) => (
                      <Picker.Item
                        key={index}
                        label={month}
                        value={index + 1}
                        style={styles.pickerItem}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Employee */}
            <View style={styles.headerContainer}>
              <Text style={{ fontSize: 14, fontWeight: "400", color: "#333" }}>
                {employee?.name}
              </Text>
              <TouchableOpacity
                onPress={generatePDF}
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  backgroundColor: "#ffb300",
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "500",
                  }}>
                  Download
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.salarySlip}>
              {/* Company Header */}
              <View style={styles.slipHeader}>
                <View style={styles.companyLogo}>
                  <Image
                    source={require("../../../Assets/logo.png")}
                    style={styles.logo}
                  />
                </View>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>
                    {office[0]?.name}
                  </Text>
                  <Text style={styles.companyAddress}>{office[0]?.addressLine1}</Text>
                  <Text style={styles.companyAddress}>
                    {office[0]?.addressLine2}
                  </Text>
                  <Text style={styles.companyAddress}>{office[0]?.addressLine3}</Text>
                </View>
              </View>

              {/* Employee Information */}
              <View style={styles.employeeInfo}>
                <Text style={styles.salaryMonth}>
                  {getMonthName(month)} {year}
                </Text>
                <Text style={styles.employeeDetail}>
                  <Text style={styles.bold}>Employee Name:</Text> {employee?.name}
                </Text>
                <Text style={styles.employeeDetail}>
                  <Text style={styles.bold}>Designation:</Text>{" "}
                  {employee?.designation?.name}
                </Text>
                <Text style={styles.employeeDetail}>
                  <Text style={styles.bold}>Employee ID:</Text>{" "}
                  {employee?.employeeId}
                </Text>
                <Text style={styles.employeeDetail}>
                  <Text style={styles.bold}>Department:</Text> IT
                </Text>
                <Text style={styles.employeeDetail}>
                  <Text style={styles.bold}>Bank Account:</Text> XXXX-XXXX-XXXX-XXXX
                </Text>
              </View>

              {/* Salary Details */}
              <View style={styles.salaryDetails}>
                <View style={styles.detailsHeader}>
                  <Text style={styles.headerText}>Particulars</Text>
                  <Text style={styles.headerText}>Amount</Text>
                </View>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryText}>Basic Salary</Text>
                  <Text style={styles.salaryText}>₹{employee?.monthlySalary}</Text>
                </View>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryText}>House Rent Allowance (HRA)</Text>
                  <Text style={styles.salaryText}>₹0.00</Text>
                </View>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryText}>Special Allowance</Text>
                  <Text style={styles.salaryText}>₹0.00</Text>
                </View>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryText}>Bonus</Text>
                  <Text style={styles.salaryText}>₹0.00</Text>
                </View>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryText}>Provident Fund (PF)</Text>
                  <Text style={styles.salaryText}>-₹0.00</Text>
                </View>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryText}>Income Tax</Text>
                  <Text style={styles.salaryText}>-₹0.00</Text>
                </View>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryText}>Deduction</Text>
                  <Text style={styles.salaryText}>-₹{monthlySalary?.totalDeduction}</Text>
                </View>
                <View style={[styles.salaryRow, styles.totalSalary]}>
                  <Text style={styles.salaryTextBold}>Total Salary</Text>
                  <Text style={styles.salaryTextBold}>
                    ₹{monthlySalary?.totalSalary}
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Signature</Text>
              </View>
            </View>
          </ScrollView>
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  buttonReset: {
    backgroundColor: "#ffb300",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonResetText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  filterContainer: {
    borderRadius: 10,
    marginVertical: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    backgroundColor: "#fff",
    color: "#333",
  },
  pickerItem: {
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scrollViewContent: {
    padding: 10,
    paddingTop: 0,
  },
  salarySlip: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  slipHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingBottom: 5,
    marginBottom: 10,
    columnGap: 11,
  },
  companyLogo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "130%",
    resizeMode: "contain",
  },
  companyInfo: {
    flex: 2,
  },
  companyName: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  companyAddress: {
    fontSize: 14,
    color: "#777",
  },
  employeeInfo: {
    marginBottom: 20,
  },
  salaryMonth: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
  employeeDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "500",
  },
  salaryDetails: {
    marginBottom: 20,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingBottom: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  salaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  salaryText: {
    fontSize: 14,
    color: "#555",
  },
  totalSalary: {
    backgroundColor: "#f9f9f9",
  },
  salaryTextBold: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  footer: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
});

export default SalarySlip;
