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
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { useRefresh } from "../../../Context/refresh.context.js";
import { useAuth } from "../../../Context/auth.context.js";
import { ActivityIndicator } from "react-native-paper";
import formatDate from "../../../Helper/formatDate.js";

const TaxInvoice = ({ navigation }) => {
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [invoice, setInvoice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoice = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/invoice/all-invoice`,
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

  const generatePDF = () => {
    console.log("pdfGenerated");
  };

  return (
    <>
      <View style={styles.header}>
        <Icon name="arrow-left" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Tax Invoice</Text>
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
              Tax invoice not found.
            </Text>
          ) : (
            invoice?.map((item, index) => (
              <View key={index} style={styles.container}>
                <Text style={styles.monthText}>{formatDate(item?.date)}</Text>
                <Text style={styles.yearText}>{item?.invoiceId}</Text>
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

export default TaxInvoice