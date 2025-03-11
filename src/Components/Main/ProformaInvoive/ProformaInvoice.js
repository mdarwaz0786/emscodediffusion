import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  RefreshControl,
} from "react-native";
import FileViewer from 'react-native-file-viewer';
import Share from "react-native-share";
import Icon from "react-native-vector-icons/Feather";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import requestStoragePermission from "./utils/requestStoragePermission.js";
import getUniqueFileName from "./utils/getUniqueFileName.js";
import { useAuth } from "../../../Context/auth.context.js";
import { API_BASE_URL } from "@env";
import axios from "axios";
import formatDate from "../../../Helper/formatDate.js";
import Toast from "react-native-toast-message";
import { useRefresh } from "../../../Context/refresh.context.js";
import { ActivityIndicator } from "react-native-paper";

const ProformaInvoice = ({ navigation }) => {
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [invoice, setInvoice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoice = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/proformaInvoice/all-proformaInvoice`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setInvoice(response?.data?.invoice);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (validToken) {
      fetchInvoice();
    };
  }, [validToken, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
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
      if (Platform.OS === "android") {
        try {
          const shareOptions = {
            title: "Open PDF",
            url: `file://${filePath}`,
            type: "application/pdf",
          };
          await Share.open(shareOptions);
        } catch (shareError) {
          Alert.alert(
            "No PDF Viewer Found",
            "Please install a PDF viewer to open this file.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Install", onPress: () => Linking.openURL("market://details?id=com.adobe.reader") },
            ]
          );
        };
      };
    };
  };

  const generatePDF = async (id) => {
    try {
      const hasPermission = await requestStoragePermission();

      if (!hasPermission) {
        Alert.alert("Permission Denied", "Cannot save file without storage permission");
        return;
      };

      let invoiceData = {};

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/proformaInvoice/single-proformaInvoice/${id}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        invoiceData = response?.data?.invoice;
      };

      const html = `
      <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proforma Invoice</title>
    <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
    }

    .content {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .invoice-container {
      background-color: white;
    }

    .invoice-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }

    .logo img {
      width: 150px;
      margin-bottom: 10px;
    }

    .invoice-title h4 {
      font-size: 18px;
    }

    .invoice-details {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    }

    .invoice-id {
      margin-bottom: 5px;
    }

    .billing-info div {
      margin-bottom: 5px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      margin-top: 20px;
    }

    .row div {
      margin-bottom: 5px;
    }

    .invoice-table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }

    .invoice-table th,
    .invoice-table td {
      text-align: left;
    }

    .invoice-table th {
      padding: 10px 20px;
      background-color: #dcf0f0 !important;
      color: #000 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .invoice-table td {
      padding: 8px 20px;
    }

    .invoice-table th.text-end,
    .invoice-table td.text-end {
      text-align: right;
    }

    .notes {
      padding: 20px;
    }

    .notes div {
      padding-bottom: 5px;
    }
  </style>
</head>

<body>
  <div class="content">
    <div class="invoice-container">
      <div class="invoice-heading">
        <div class="logo">
          <img src="${invoiceData?.office?.logo}" alt="logo">
        </div>
        <div class="invoice-title">
          <h4>PROFORMA INVOICE</h4>
        </div>
      </div>
      <div class="invoice-details">
        <div class="billing-info">
          <div><strong>${invoiceData?.office?.name || "Code diffusion Technology"}</strong></div>
          <div>Address:</div>
          <div>${invoiceData?.office?.addressLine1 || "120, Kirti Shikhar Tower"},</div>
          <div>${invoiceData?.office?.addressLine2 || "District Centre, Janakpuri"},</div>
          <div>${invoiceData?.office?.addressLine3 || "New Delhi"}.</div>
          <div><strong>GST No: ${invoiceData?.office?.GSTNumber || "O7FRWPS7288J3ZC"}</strong></div>
        </div>
        <div class="invoice-meta">
          <div class="invoice-id">Invoice ID: <strong>${invoiceData?.proformaInvoiceId}</strong></div>
          <div class="invoice-date">
            <strong>Date:</strong>
            <span>${formatDate(invoiceData?.date)}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="billing-address">
          <div><strong>Bill To:</strong></div>
          <div>${invoiceData?.companyName || invoiceData?.clientName}</div>
          <div><strong>GST No: ${invoiceData?.GSTNumber}</strong></div>
        </div>
        <div class="shipping-address">
          <div><strong>Ship To:</strong></div>
          <div>${invoiceData?.shipTo}</div>
        </div>
        <div class="balance-due">
          <p><strong>Balance Due: ₹${invoiceData?.total}</strong></p>
        </div>
      </div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th class="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${invoiceData?.projectName}</td>
            <td>1</td>
            <td>₹${invoiceData?.subtotal}</td>
            <td class="text-end">₹${invoiceData?.subtotal}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
            <td class="text-end">₹${invoiceData?.subtotal}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>CGST (9%):</strong></td>
            <td class="text-end">₹${invoiceData?.CGST}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>SGST (9%):</strong></td>
            <td class="text-end">₹${invoiceData?.SGST}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>IGST (18%):</strong></td>
            <td class="text-end">₹${invoiceData?.IGST}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
            <td class="text-end">₹${invoiceData?.total}</td>
          </tr>
        </tfoot>
      </table>
      <div class="notes">
        <div><strong>Notes:</strong></div>
        <div><strong>Account Name: </strong>${invoiceData?.office?.accountName || "Code Diffusion Technologies"}</div>
        <div><strong>Account Type: </strong>${invoiceData?.office?.accountType || "Current Account"}</div>
        <div><strong>Account Number: </strong>${invoiceData?.office?.accountNumber || "60374584640"}</div>
        <div><strong>Bank Name: </strong>${invoiceData?.office?.bankName || "Bank of Maharashtra"}</div>
        <div><strong>IFSC Code: </strong>${invoiceData?.office?.IFSCCode || "mahb0001247"}</div>
      </div>
    </div>
  </div>
</body>

</html>`;

      const fileNameBase = `${invoiceData?.proformaInvoiceId}-proforma-invoice`;
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
        Toast.show({ type: "success", text1: "Invoice Downloaded", text2: `Slip saved at: ${newPath}` });

        setTimeout(() => {
          openPDF(newPath);
        }, 3000)
      } catch (error) {
        Alert.alert("Error", "Failed to generate PDF");
      };
    } catch (error) {
      console.log("Error:", error.message);
    };
  };

  return (
    <>
      <View style={styles.header}>
        <Icon name="arrow-left" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Proforma Invoice</Text>
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
          ) : invoice?.length === 0 ? (
            <Text style={{ flex: 1, textAlign: "center", color: "#777" }}>
              Proforma invoice not found.
            </Text>
          ) : (
            invoice?.map((item, index) => (
              <View key={index} style={styles.container}>
                <Text style={styles.monthText}>{(new Date(item?.date)).toLocaleDateString("en-IN")}</Text>
                <Text style={styles.yearText}>{item?.proformaInvoiceId}</Text>
                <TouchableOpacity
                  onPress={() => generatePDF(item?._id)}
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
    paddingVertical: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
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
    paddingVertical: 5,
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

export default ProformaInvoice