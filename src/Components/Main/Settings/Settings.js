import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";

const Settings = ({ navigation }) => {
  const [office, setOffice] = useState([]);
  const { validToken } = useAuth();

  useEffect(() => {
    fetchOfficeLocation();
  }, []);

  const fetchOfficeLocation = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/officeLocation/all-officeLocation`,
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
      console.error("Error while fetching office:", error.message);
    }
  };

  const renderOfficeCard = ({ item }) => (
    <View style={styles.card}>
      {item.logo && (
        <Image source={{ uri: item.logo }} style={styles.logo} />
      )}
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDetail}>{item.email}</Text>
      <Text style={styles.cardDetail}>{item.contact}</Text>
      <Text style={styles.cardDetail}>{item.addressLine1}</Text>
      {item.addressLine2 && <Text style={styles.cardDetail}>{item.addressLine2}</Text>}
      {item.addressLine3 && <Text style={styles.cardDetail}>{item.addressLine3}</Text>}
    </View>
  );

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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddOffice")}
        >
          <Text style={styles.addButtonText}>Add New Office</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Offices</Text>

        <FlatList
          data={office}
          keyExtractor={(item) => item._id}
          renderItem={renderOfficeCard}
          contentContainerStyle={styles.cardContainer}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 100,
    padding: 12,
    backgroundColor: "#fff",
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  addButton: {
    backgroundColor: "#A63ED3",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 30,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "400",
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    textAlign: "center",
  },
  cardContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 130,
    height: 50,
    resizeMode: "contain",
    marginBottom: 8,
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  cardDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
    textAlign: "center",
  },
});

export default Settings;
