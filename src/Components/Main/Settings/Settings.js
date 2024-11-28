import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { useAuth } from "../../../Context/auth.context.js";

const Settings = ({ navigation }) => {
  const { validToken } = useAuth();
  const [office, setOffice] = useState([]);
  const [popupVisible, setPopupVisible] = useState(null);

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
      console.error("Error while fetching office location:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/officeLocation/delete-officeLocation/${id}`, {
        headers: {
          Authorization: validToken,
        },
      });
      fetchOfficeLocation();
      setPopupVisible(null);
    } catch (error) {
      console.error("Error while deleting office location:", error.message);
    }
  };

  const renderOfficeCard = (item) => (
    <View style={styles.card} key={item?._id}>
      <View style={styles.cardHeader}>
        {item?.logo && <Image source={{ uri: item?.logo }} style={styles.logo} />}
        <Pressable onPress={() => setPopupVisible(popupVisible === item?._id ? null : item?._id)}>
          <Icon name="more-vertical" size={20} color="#333" />
        </Pressable>
      </View>
      <Text style={styles.cardDetail}>Name: {item?.name}</Text>
      <Text style={styles.cardDetail}>Email: {item?.email}</Text>
      <Text style={styles.cardDetail}>Contact: {item?.contact}</Text>
      <Text style={styles.cardDetail}>Latitude: {item?.latitude}</Text>
      <Text style={styles.cardDetail}>Longitude: {item?.longitude}</Text>
      <Text style={styles.cardDetail}>Address: {item?.addressLine1}</Text>
      {item?.addressLine2 && (
        <Text style={styles.cardDetail}> {item?.addressLine2}</Text>
      )}
      {item?.addressLine3 && (
        <Text style={styles.cardDetail}> {item?.addressLine3}</Text>
      )}

      {/* Popup for Edit/Delete */}
      {popupVisible === item?._id && (
        <View style={styles.popup}>
          <TouchableOpacity
            style={styles.popupOption}
            onPress={() => {
              setPopupVisible(null);
              navigation.navigate("EditOffice", { id: item?._id });
            }}
          >
            <Text style={styles.popupOptionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.popupOption, styles.deleteOption]}
            onPress={() => handleDelete(item?._id)}
          >
            <Text style={styles.popupOptionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
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
        {/* Add New Office Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddOffice")}
        >
          <Text style={styles.addButtonText}>Add New Office</Text>
        </TouchableOpacity>

        {/* Office Locations */}
        <Text style={styles.pageTitle}>Offices</Text>
        <ScrollView
          contentContainerStyle={[styles.cardContainer, { flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={() => setPopupVisible(null)}
          >
            {office.map((item) => renderOfficeCard(item))}
          </Pressable>
        </ScrollView>
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
  },
  addButton: {
    backgroundColor: "#A63ED3",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  cardContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    paddingTop: 10,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    alignSelf: "center",
  },
  cardDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  popup: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
    elevation: 3,
  },
  popupOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  popupOptionText: {
    fontSize: 14,
    color: "#333",
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});

export default Settings;
