import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, PermissionsAndroid, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';

const SalarySlip = () => {
  // Request storage permissions
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "This app needs access to your storage to save PDFs.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the storage");
      } else {
        console.log("Storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const generatePDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { padding: 15px; }
            .header { border-bottom: 1px solid #e1e1e1; padding-bottom: 10px; margin-bottom: 20px; }
            .company-name { font-size: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-name">XYZ Tech Solutions</div>
            </div>
            <div class="footer">
              <p>Thank you for your hard work!</p>
            </div>
          </div>
        </body>
      </html>
    `;

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
    <View style={styles.container}>
      <Text style={styles.title}>Salary Slip</Text>
      <Button title="Generate PDF" onPress={generatePDF} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SalarySlip;