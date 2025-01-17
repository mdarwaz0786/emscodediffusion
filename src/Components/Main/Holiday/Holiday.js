import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import Calender from "react-native-vector-icons/MaterialCommunityIcons";
import { useRefresh } from "../../../Context/refresh.context.js";
import formatDate from "../../../Helper/formatDate.js";

const Holiday = ({ navigation }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshKey, refreshPage } = useRefresh();
  const { validToken } = useAuth();

  useEffect(() => {
    setMonth(currentMonth);
    setYear(currentYear);
  }, []);

  const fetchAllHoliday = async () => {
    try {
      setLoading(true);

      const params = {};

      if (month) {
        const formattedMonth = month.toString().padStart(2, "0");
        params.month = formattedMonth;
      }

      if (year) {
        params.year = year;
      }

      const response = await axios.get(`${API_BASE_URL}/api/v1/holiday/all-holiday`,
        {
          params,
          headers: {
            Authorization: validToken
          },
        },
      );

      if (response?.data?.success) {
        setHolidays(response?.data?.holiday);
      }
    } catch (error) {
      console.log("Error while fetching holiday:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (validToken && year && month) {
      fetchAllHoliday();
    }
  }, [validToken, refreshKey, year, month]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const renderItem = ({ item, index }) => {
    if (index % 2 !== 0) return null;
    const nextItem = holidays[index + 1];
    return (
      <View style={styles.rowContainer}>
        <View style={styles.notificationCard}>
          <View style={styles.cardHeader}>
            <Calender name="calendar" size={22} color="#ffb300" style={styles.icon} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item?.reason}</Text>
              <Text style={styles.cardDate}>{formatDate(item?.date)}</Text>
            </View>
          </View>
        </View>

        {nextItem && (
          <View style={styles.notificationCard}>
            <View style={styles.cardHeader}>
              <Calender name="calendar" size={22} color="#ffb300" style={styles.icon} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{nextItem?.reason}</Text>
                <Text style={styles.cardDate}>{formatDate(nextItem?.date)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <Icon name="arrow-left" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Holiday</Text>
        <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate("AddHoliday")}>
          <Text style={styles.buttonAddText}>Add Holiday</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerRow}>
          {/* Year Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={year}
              onValueChange={itemValue => setYear(itemValue)}
              style={styles.picker}>
              {Array.from({ length: 5 }, (_, index) => {
                const yearOption = currentYear - index;
                return (
                  <Picker.Item
                    key={yearOption}
                    label={String(yearOption)}
                    value={yearOption}
                    style={styles.pickerItem}
                  />
                );
              })}
            </Picker>
          </View>

          {/* Month Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={month}
              onValueChange={itemValue => setMonth(itemValue)}
              style={styles.picker}
            >
              {monthNames?.map((month, index) => (
                <Picker.Item
                  key={index}
                  label={month}
                  value={index + 1}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : holidays?.length === 0 ? (
          <View style={styles.centeredView}>
            <Text style={styles.noHolidaysText}>Holiday not found</Text>
          </View>
        ) : (
          <FlatList
            data={holidays}
            renderItem={renderItem}
            keyExtractor={(item) => item?._id}
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  buttonAdd: {
    backgroundColor: "#ffb300",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonAddText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  filterContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    backgroundColor: "#fff",
    color: "#333",
  },
  pickerItem: {
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  notificationCard: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 8,
    marginHorizontal: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
