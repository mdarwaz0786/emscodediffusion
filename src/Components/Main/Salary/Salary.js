import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, Image, Pressable } from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import requestStoragePermission from './utils/requestStoragePermission.js';
import { useAuth } from '../../../Context/auth.context.js';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from "@env";
import getMonthName from './utils/getMonthName.js';

const SalarySlip = ({ route }) => {
  const id = route?.params?.id;
  const { validToken, isLoading } = useAuth();
  const [monthlySalary, setMonthlySalary] = useState("");
  const [employee, setEmployee] = useState("");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [employeeId, setEmployeeId] = useState(id);
  const navigation = useNavigation();

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

  // Fetch single employee
  const fetchSingleEmployee = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/single-team/${id}`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setEmployee(response?.data?.team);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Get current month salary for employee
  const fetchMonthlySalary = async () => {
    try {
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
      };
    } catch (error) {
      console.error("Error while fetching monthly salary:", error.message);
    };
  };

  useEffect(() => {
    if (employeeId && month && year && validToken && !isLoading) {
      fetchMonthlySalary();
    };
  }, [employeeId, month, year, validToken, isLoading]);

  // Function to reset filters to initial values
  const resetFilters = () => {
    setMonth(currentMonth);
    setYear(currentYear);
    setEmployeeId(id);
    fetchSingleEmployee(id);
    fetchMonthlySalary();
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
          <img src="https://www.codediffusion.in/img/website-designing-company-in%20delhi.png" alt="Company Logo">
        </div>
        <div class="companyInfo">
          <div class="companyName">Code Diffusuion Technologies</div>
          <div class="companyAddress">120, Kirti Sikhar Tower</div>
          <div class="companyAddress">District Center, Janakpuri</div>
          <div class="companyAddress">New Delhi</div>
        </div>
      </div>

      <!-- Employee Information -->
      <div class="employeeInfo">
        <div class="salaryMonth">${getMonthName(month)} ${year}</div>
        <div class="employeeDetail"><span class="bold">Employee Name:</span>  ${employee?.name}</div>
        <div class="employeeDetail"><span class="bold">Designation:</span> ${employee?.designation?.name}</div>
        <div class="employeeDetail"><span class="bold">Employee ID:</span> ${employee?.employeeId}</div>
        <div class="employeeDetail"><span class="bold">Department:</span> IT</div>
        <div class="employeeDetail"><span class="bold">Bank Account:</span> XXXX-XXXX-1234</div>
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
        <div class="salaryRow totalSalary">
          <div class="salaryTextBold">Total Salary</div>
          <div class="salaryTextBold">₹${monthlySalary?.totalSalary}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footerText">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>

</html>`;

    let options = {
      html: html,
      fileName: `Salary-${getMonthName(month).slice(0, 3)}-${year}-${employee?.name.split(" ", 1)[0]}`,
      directory: 'Downloads', // Ensure this is set to 'Downloads'
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const newPath = await `${RNFetchBlob.fs.dirs.DownloadDir}/Salary-${getMonthName(month).slice(0, 3)}-${year}-${employee?.name.split(" ", 1)[0]}.pdf`; // Set the new path
      await RNFetchBlob.fs.mv(file.filePath, newPath); // Move the file to the new path
      Alert.alert('PDF Generated', `File saved to: ${newPath}`);
      console.log('PDF saved successfully at:', newPath);
    } catch (error) {
      console.error('Error while generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

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
        <Pressable style={styles.buttonReset} onPress={resetFilters}>
          <Text style={styles.buttonResetText}>Reset Filter</Text>
        </Pressable>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerRow}>
          {/* Year Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={year}
              onValueChange={itemValue => setYear(itemValue)}
              style={styles.picker}>
              {Array.from({ length: 5 }, (_, index) => {
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
              style={styles.picker}>
              {Array.from({ length: 12 }, (_, index) => (
                <Picker.Item
                  key={index}
                  label={new Date(0, index).toLocaleString("default", {
                    month: "long",
                  })}
                  value={index}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Employee */}
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 15, fontWeight: "400", color: "#555" }}>{employee?.name}</Text>
        <Pressable
          onPress={generatePDF}
          style={{
            backgroundColor: "#4CAF50",
            paddingVertical: 2,
            paddingHorizontal: 7,
            borderRadius: 5,
          }}
        >
          <Text style={{ fontSize: 13, color: "#FFF", fontWeight: "400", paddingVertical: 2, paddingHorizontal: 5, }}>
            Download
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.salarySlip}>
          {/* Company Header */}
          <View style={styles.slipHeader}>
            <View style={styles.companyLogo}>
              <Image source={require("../../../Assets/logo.png")} style={styles.logo} />
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>Code Diffusion Technologies</Text>
              <Text style={styles.companyAddress}>120, Kirti Sikhar Tower</Text>
              <Text style={styles.companyAddress}>District Center, Janakpuri</Text>
              <Text style={styles.companyAddress}>New Delhi</Text>
            </View>
          </View>

          {/* Employee Information */}
          <View style={styles.employeeInfo}>
            <Text style={styles.salaryMonth}>{getMonthName(month)} {year}</Text>
            <Text style={styles.employeeDetail}>
              <Text style={styles.bold}>Employee Name:</Text> {employee?.name}
            </Text>
            <Text style={styles.employeeDetail}>
              <Text style={styles.bold}>Designation:</Text> {employee?.designation?.name}
            </Text>
            <Text style={styles.employeeDetail}>
              <Text style={styles.bold}>Employee ID:</Text> {employee?.employeeId}
            </Text>
            <Text style={styles.employeeDetail}>
              <Text style={styles.bold}>Department:</Text> IT
            </Text>
            <Text style={styles.employeeDetail}>
              <Text style={styles.bold}>Bank Account:</Text> XXXX-XXXX-1234
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
            <View style={[styles.salaryRow, styles.totalSalary]}>
              <Text style={styles.salaryTextBold}>Total Salary</Text>
              <Text style={styles.salaryTextBold}>₹{monthlySalary?.totalSalary}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Authorized Signatory</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  buttonReset: {
    backgroundColor: "#B22222",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonResetText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
  },
  filterContainer: {
    paddingHorizontal: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  picker: {
    backgroundColor: "#fff",
  },
  pickerItem: {
    fontSize: 14,
    color: "#333",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    padding: 10,
    paddingTop: 0,
  },
  salarySlip: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  slipHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingBottom: 10,
    marginBottom: 10,
    columnGap: 11,
  },
  companyLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: "130%",
    resizeMode: 'contain',
  },
  companyInfo: {
    flex: 2,
  },
  companyName: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  companyAddress: {
    fontSize: 13,
    color: '#777',
  },
  employeeInfo: {
    marginBottom: 20,
  },
  salaryMonth: {
    fontSize: 14,
    color: '#555',
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
  employeeDetail: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  bold: {
    fontWeight: '500',
  },
  salaryDetails: {
    marginBottom: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingBottom: 5,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  salaryText: {
    fontSize: 13,
    color: '#555',
  },
  totalSalary: {
    backgroundColor: '#f9f9f9',
  },
  salaryTextBold: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#555',
    fontWeight: "500",
  },
});

export default SalarySlip;