import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import getUserLocation from "../Home/utils/getUerLocation.js";

const EditOffice = ({ navigation, route }) => {
  const id = route?.params?.id;
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();

  async function fetchLatLong() {
    const position = await getUserLocation();

    if (!position) {
      Toast.show({ type: "error", text1: "Please enable location" });
      return;
    }

    const { latitude, longitude } = position;

    setLatitude(String(latitude));
    setLongitude(String(longitude));
  };

  const selectLogo = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          Toast.show({ type: "info", text1: "Image selection canceled" });
        } else if (response.errorCode) {
          Toast.show({ type: "error", text1: "Image selection error" });
        } else {
          setLogo(response.assets[0]);
        }
      },
    );
  };

  const fetchOfficeLocation = async id => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/officeLocation/single-officeLocation/${id}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        const office = response?.data?.officeLocation;
        setName(office?.name);
        setLogo(office?.logo);
        setEmail(office?.email);
        setContact(office?.contact);
        setLatitude(office?.latitude);
        setLongitude(office?.longitude);
        setAddressLine1(office?.addressLine1);
        setAddressLine2(office?.addressLine2);
        setAddressLine3(office?.addressLine3);
      }
    } catch (error) {
      console.log("Error while fetching office location:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOfficeLocation(id);
    }
  }, [id, refreshKey]);

  const handleUpdate = async id => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("addressLine1", addressLine1);
    formData.append("addressLine2", addressLine2);
    formData.append("addressLine3", addressLine3);
    // Append logo only if a new one is uploaded
    if (logo && logo.uri) {
      formData.append("logo", {
        uri: logo.uri,
        type: logo.type,
        name: logo.fileName,
      });
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/officeLocation/update-officeLocation/${id}`,
        formData,
        {
          headers: {
            Authorization: validToken,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.success) {
        setName("");
        setLogo(null);
        setEmail("");
        setContact("");
        setLatitude("");
        setLongitude("");
        setAddressLine1("");
        setAddressLine2("");
        setAddressLine3("");
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error:", error.message);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "An error occurred",
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
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
        <Text style={styles.headerTitle}>Edit Office</Text>
        <TouchableOpacity style={styles.buttonReset} onPress={fetchLatLong}>
          <Text style={styles.buttonResetText}>Reset Location</Text>
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <View style={styles.container}>
              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>
                  Company Name <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>Upload Logo</Text>
                <TouchableOpacity onPress={selectLogo} style={styles.logoButton}>
                  <Text style={styles.logoButtonText}></Text>
                </TouchableOpacity>
              </View>

              {logo && (
                <Image
                  source={{ uri: logo.uri || logo }}
                  style={styles.logoPreview}
                />
              )}

              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>
                  Email Id <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>

              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>
                  Contact Number <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  value={contact}
                  onChangeText={setContact}
                  style={styles.input}
                />
              </View>

              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>
                  Latitude <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  value={latitude}
                  onChangeText={setLatitude}
                  style={styles.input}
                />
              </View>

              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>
                  Longitude <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  value={longitude}
                  onChangeText={setLongitude}
                  style={styles.input}
                />
              </View>

              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>
                  Address Line 1 <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  value={addressLine1}
                  onChangeText={setAddressLine1}
                  style={styles.input}
                />
              </View>

              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>Address Line 2</Text>
                <TextInput
                  value={addressLine2}
                  onChangeText={setAddressLine2}
                  style={styles.input}
                />
              </View>

              <View style={{ marginBottom: 0 }}>
                <Text style={{ marginBottom: 5, color: "#555" }}>Address Line 3</Text>
                <TextInput
                  value={addressLine3}
                  onChangeText={setAddressLine3}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleUpdate(id)}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
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
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 10,
    paddingTop: 8,
  },
  input: {
    padding: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#777",
  },
  logoButton: {
    backgroundColor: "#fff",
    padding: 10,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 12,
  },
  logoButtonText: {
    color: "#777",
    fontWeight: "400",
  },
  logoPreview: {
    width: "100%",
    height: 40,
    marginBottom: 5,
    resizeMode: "contain",
  },
  submitButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default EditOffice;
