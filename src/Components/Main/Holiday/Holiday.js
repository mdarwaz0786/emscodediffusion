import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import axios from 'axios';
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "@env";
import { useAuth } from '../../../Context/auth.context.js';
import Calender from 'react-native-vector-icons/MaterialCommunityIcons';
import formatDate from '../../../Helper/formatDate.js';

const Holiday = ({ navigation }) => {
  const [holidays, setHolidays] = useState([]);
  const { validToken } = useAuth();

  useEffect(() => {
    fetchUpcomingHoliday();
  }, []);

  const fetchUpcomingHoliday = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/holiday/upcoming-holiday`,
        {
          headers: {
            Authorization: validToken,
          },
        }
      );

      if (response?.data?.success) {
        setHolidays(response?.data?.holiday);
      }
    } catch (error) {
      console.error('Error while fetching upcoming holiday:', error.message);
    }
  };

  // Render each upcoming holiday
  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.cardHeader}>
        <Calender name="calendar" size={22} color="#A63ED3" style={styles.icon} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item?.reason}</Text>
          <Text style={styles.cardDate}>{formatDate(item?.date)}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>The office will be closed on {formatDate(item?.date)} for {item?.reason}.</Text>
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
          onPress={() => navigation.navigate("AddHoliday")}
        >
          <Text style={styles.addButtonText}>Add New Holiday</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Upcoming Holidays</Text>

        {holidays?.length > 0 ? (
          <FlatList
            data={holidays}
            renderItem={renderItem}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.noHolidaysText}>No upcoming holidays</Text>
        )}
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
  pageTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#A63ED3',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '400',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '400',
    color: '#333',
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
  },
  listContainer: {
    paddingBottom: 16,
  },
  noHolidaysText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
});

export default Holiday;