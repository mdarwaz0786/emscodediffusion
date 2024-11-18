import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, Image } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import requestStoragePermission from './utils/requestStoragePermission.js';

const SalarySlip = () => {

  useEffect(() => {
    requestStoragePermission();
  }, []);

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
      width: 60vw;
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
      margin-left: 10px;
    }

    .companyName {
      font-size: 18px;
      color: #333;
      font-weight: 500;
    }

    .companyAddress,
    .companyContact {
      font-size: 14px;
      color: #777;
    }

    .employeeInfo {
      margin-bottom: 20px;
    }

    .salaryMonth {
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 500;
      text-align: center;
    }

    .employeeDetail {
      font-size: 14px;
      color: #555;
      margin-bottom: 5px;
    }

    .bold {
      font-weight: 600;
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
      font-weight: bold;
      color: #555;
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
      font-weight: 550;
      color: #333;
    }

    .footer {
      text-align: right;
      margin-top: 20px;
    }

    .footerText {
      font-size: 16px;
      color: #555;
      font-weight: 500;
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
        <div class="salaryMonth">November 2024</div>
        <div class="employeeDetail"><span class="bold">Employee Name:</span> Md Arwaz</div>
        <div class="employeeDetail"><span class="bold">Designation:</span> Software Engineer</div>
        <div class="employeeDetail"><span class="bold">Employee ID:</span> EMPID003</div>
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
          <div class="salaryText">₹3000</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">House Rent Allowance (HRA)</div>
          <div class="salaryText">₹1200</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Special Allowance</div>
          <div class="salaryText">₹500</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Bonus</div>
          <div class="salaryText">₹300</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Provident Fund (PF)</div>
          <div class="salaryText">-₹200</div>
        </div>
        <div class="salaryRow">
          <div class="salaryText">Income Tax</div>
          <div class="salaryText">-₹250</div>
        </div>
        <div class="salaryRow totalSalary">
          <div class="salaryTextBold">Total Salary</div>
          <div class="salaryTextBold">₹3550</div>
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
      fileName: 'SalarySlip',
      directory: 'Downloads', // Ensure this is set to 'Downloads'
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const newPath = `${RNFetchBlob.fs.dirs.DownloadDir}/SalarySlip.pdf`; // Set the new path
      await RNFetchBlob.fs.mv(file.filePath, newPath); // Move the file to the new path
      Alert.alert('PDF Generated', `File saved to: ${newPath}`);
      console.log('PDF saved successfully at:', newPath);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Button title="Download Slip" onPress={generatePDF} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.salarySlip}>
          {/* Company Header */}
          <View style={styles.header}>
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
            <Text style={styles.salaryMonth}>November 2024</Text>
            <Text style={styles.employeeDetail}>
              <Text style={styles.bold}>Employee Name:</Text> Md Arwaz
            </Text>
            <Text style={styles.employeeDetail}>
              <Text style={styles.bold}>Designation:</Text> Software Engineer
            </Text>
            <Text style={styles.employeeDetail}>
              <Text style={styles.bold}>Employee ID:</Text> EMPID003
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
              <Text style={styles.salaryText}>₹3000</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryText}>House Rent Allowance (HRA)</Text>
              <Text style={styles.salaryText}>₹1200</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryText}>Special Allowance</Text>
              <Text style={styles.salaryText}>₹500</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryText}>Bonus</Text>
              <Text style={styles.salaryText}>₹300</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryText}>Provident Fund (PF)</Text>
              <Text style={styles.salaryText}>-₹200</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryText}>Income Tax</Text>
              <Text style={styles.salaryText}>-₹250</Text>
            </View>
            <View style={[styles.salaryRow, styles.totalSalary]}>
              <Text style={styles.salaryTextBold}>Total Salary</Text>
              <Text style={styles.salaryTextBold}>₹3550</Text>
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
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  salarySlip: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  header: {
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
    width: 120,
    resizeMode: 'contain',
  },
  companyInfo: {
    flex: 2,
  },
  companyName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  companyAddress: {
    fontSize: 14,
    color: '#777',
  },
  employeeInfo: {
    marginBottom: 20,
  },
  salaryMonth: {
    fontSize: 17,
    color: '#333',
    marginBottom: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  employeeDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  salaryText: {
    fontSize: 14,
    color: '#333',
  },
  totalSalary: {
    fontWeight: '500',
    backgroundColor: '#f9f9f9',
  },
  salaryTextBold: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#555',
    fontWeight: "500",
  },
});

export default SalarySlip;