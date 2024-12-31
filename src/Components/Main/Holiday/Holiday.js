import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, TextInput, Pressable } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import Calender from "react-native-vector-icons/MaterialCommunityIcons";
import { useRefresh } from "../../../Context/refresh.context.js";
import formatDate from "../../../Helper/formatDate.js";

const Holiday = ({ navigation }) => {
  const [holidays, setHolidays] = useState([]);
  const [popupVisible, setPopupVisible] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshKey, refreshPage } = useRefresh();
  const { validToken } = useAuth();

  const fetchUpcomingHoliday = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/holiday/upcoming-holiday`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setHolidays(response?.data?.holiday);
      }
    } catch (error) {
      console.log("Error while fetching upcoming holiday:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (validToken) {
      fetchUpcomingHoliday();
    }
  }, [validToken, refreshKey]);

  const handleDelete = async () => {
    if (confirmationText.toLowerCase() === "yes" && holidayToDelete) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/v1/holiday/delete-holiday/${holidayToDelete}`,
          {
            headers: {
              Authorization: validToken,
            },
          },
        );

        if (response?.data?.success) {
          fetchUpcomingHoliday();
          Toast.show({ type: "success", text1: "Deleted successfully" });
        }
      } catch (error) {
        console.log("Error while deleting holiday:", error.message);
      } finally {
        setConfirmationVisible(false);
        setPopupVisible(null);
        setHolidayToDelete(null);
        setConfirmationText("");
      }
    } else {
      alert("Please type 'yes' to confirm deletion.");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  // Render each upcoming holiday
  const renderItem = ({ item }) => (
    <Pressable onPress={() => setPopupVisible(null)} style={styles.notificationCard}>
      <View style={styles.cardHeader}>
        <Calender
          name="calendar"
          size={22}
          color="#ffb300"
          style={styles.icon}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item?.reason}</Text>
          <Text style={styles.cardDate}>{formatDate(item?.date)}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            setPopupVisible(popupVisible === item?._id ? null : item?._id)
          }>
          <Icon name="more-vertical" size={20} color="#333" />
        </TouchableOpacity>

        {/* Popup for Edit/Delete */}
        {popupVisible === item?._id && (
          <View style={styles.popup}>
            <TouchableOpacity
              style={[styles.popupOption, styles.deleteOption]}
              onPress={() => {
                setHolidayToDelete(item?._id);
                setConfirmationVisible(true);
              }}>
              <Text style={styles.popupOptionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.cardDescription}>
        The office will be closed on {formatDate(item?.date)} for {item?.reason}.
      </Text>
    </Pressable>
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
        <Text style={styles.headerTitle}>Holiday</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddHoliday")}>
          <Text style={styles.addButtonText}>Add New Holiday</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Upcoming Holidays</Text>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : holidays?.length === 0 ? (
          <View style={styles.centeredView}>
            <Text style={styles.noHolidaysText}>No upcoming holidays at the moment.</Text>
          </View>
        ) : (
          <FlatList
            data={holidays}
            renderItem={renderItem}
            keyExtractor={item => item?._id}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}

        {/* Confirmation Modal */}
        <Modal
          visible={confirmationVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setConfirmationVisible(false);
            setConfirmationText("");
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Type <Text style={styles.modalHighlight}>"yes"</Text> to confirm
                the deletion.
              </Text>
              <TextInput
                style={styles.modalInput}
                value={confirmationText}
                onChangeText={setConfirmationText}
                placeholderTextColor="#777"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleDelete}>
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setConfirmationVisible(false);
                    setPopupVisible(null);
                    setConfirmationText("");
                  }}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
  pageTitle: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  icon: {
    marginRight: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
  },
  cardDate: {
    fontSize: 13,
    color: "#777",
  },
  popup: {
    position: "absolute",
    top: 0,
    right: 40,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 10,
  },
  popupOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  popupOptionText: {
    fontSize: 14,
    color: "#555",
  },
  deleteOption: {
    borderTopWidth: 0,
    borderTopColor: "#eee",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    paddingTop: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  modalHighlight: {
    fontWeight: "500",
    color: "#ffb300",
  },
  modalInput: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#777"
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#ffb300",
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
  },
  noHolidaysText: {
    fontSize: 14,
    color: "#777",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Holiday;
