import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const SalarySlip = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.salarySlip}>
        {/* Company Header */}
        <View style={styles.header}>
          <View style={styles.companyLogo}>
            <Image source={require("../../../Assets/logo.png")} style={styles.logo} />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>XYZ Tech Solutions</Text>
            <Text style={styles.companyAddress}>123 Tech Street, City, Country</Text>
            <Text style={styles.companyContact}>Phone: (123) 456-7890 | Email: contact@xyztech.com</Text>
          </View>
        </View>

        {/* Employee Information */}
        <View style={styles.employeeInfo}>
          <Text style={styles.salaryMonth}>November 2024</Text>
          <Text style={styles.employeeDetail}><Text style={styles.bold}>Employee Name:</Text> John Doe</Text>
          <Text style={styles.employeeDetail}><Text style={styles.bold}>Designation:</Text> Software Developer</Text>
          <Text style={styles.employeeDetail}><Text style={styles.bold}>Employee ID:</Text> EMP12345</Text>
          <Text style={styles.employeeDetail}><Text style={styles.bold}>Department:</Text> IT</Text>
          <Text style={styles.employeeDetail}><Text style={styles.bold}>Bank Account:</Text> XXXX-XXXX-1234</Text>
        </View>

        {/* Salary Details */}
        <View style={styles.salaryDetails}>
          <View style={styles.detailsHeader}>
            <Text style={styles.headerText}>Particulars</Text>
            <Text style={styles.headerText}>Amount</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryText}>Basic Salary</Text>
            <Text style={styles.salaryText}>$3000</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryText}>House Rent Allowance (HRA)</Text>
            <Text style={styles.salaryText}>$1200</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryText}>Special Allowance</Text>
            <Text style={styles.salaryText}>$500</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryText}>Bonus</Text>
            <Text style={styles.salaryText}>$300</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryText}>Provident Fund (PF)</Text>
            <Text style={styles.salaryText}>-$200</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryText}>Income Tax</Text>
            <Text style={styles.salaryText}>-$250</Text>
          </View>
          <View style={[styles.salaryRow, styles.totalSalary]}>
            <Text style={styles.salaryTextBold}>Total Salary</Text>
            <Text style={styles.salaryTextBold}>$3550</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your hard work!</Text>
          <Text style={styles.footerText}>Authorized Signatory</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  salarySlip: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingBottom: 10,
    marginBottom: 20,
  },
  companyLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  logo: {
    width: 160,
    height: 80,
    resizeMode: 'contain',
  },
  companyInfo: {
    flex: 2,
    justifyContent: 'center',
    marginLeft: 10,
  },
  companyName: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  companyAddress: {
    fontSize: 14,
    color: '#777',
  },
  companyContact: {
    fontSize: 14,
    color: '#777',
  },
  employeeInfo: {
    marginBottom: 20,
  },
  salaryMonth: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  employeeDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  salaryDetails: {
    marginBottom: 30,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingBottom: 5,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
  },
  salaryTextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    marginTop: 0,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#555',
  },
});

export default SalarySlip;
