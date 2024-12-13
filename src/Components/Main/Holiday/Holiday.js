import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import Calender from "react-native-vector-icons/MaterialCommunityIcons";
import { useRefresh } from "../../../Context/refresh.context.js";
import formatDate from "../../../Helper/formatDate.js";

const Holiday = ({ navigation }) => {
  const [holidays, setHolidays] = useState([]);
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
      console.error("Error while fetching upcoming holiday:", error.message);
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

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  // Render each upcoming holiday
  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
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
      </View>
      <Text style={styles.cardDescription}>
        The office will be closed on {formatDate(item?.date)} for {item?.reason}.
      </Text>
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
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    marginBottom: 12,
    textAlign: "center",
    color: "#000",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#ffb300",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 18,
    marginTop: 5,
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
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  icon: {
    marginRight: 10,
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
    fontSize: 12,
    color: "#888",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
  },
  listContainer: {
    paddingBottom: 16,
  },
  noHolidaysText: {
    fontSize: 15,
    color: "#aaa",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Holiday;
