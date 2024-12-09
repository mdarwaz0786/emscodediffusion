import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Calender from "react-native-vector-icons/MaterialCommunityIcons";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import formatDate from "../../../Helper/formatDate.js";
import axios from "axios";

const UpcomingHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { validToken } = useAuth();

  // Fetch holidays
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
  }, [validToken]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUpcomingHoliday();
  };

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
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Holidays</Text>
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      ) : holidays?.length === 0 ? (
        <View style={styles.centeredView}>
          <Text style={styles.noHolidaysText}>No Upcoming Holidays</Text>
        </View>
      ) : (
        <FlatList
          data={holidays}
          renderItem={renderItem}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
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
    fontSize: 15,
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

export default UpcomingHolidays;
