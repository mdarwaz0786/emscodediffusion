import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from "@env";
import { useAuth } from '../../../Context/auth.context.js';
import formatDate from '../../../Helper/formatDate.js';

const Notification = () => {
  const { validToken, team } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/notification/notificationByEmployee`,
        {
          params: { employeeId: team?._id },
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setNotifications(response?.data?.data);
      };
    } catch (error) {
      console.log("Error:", error.message);
    };
  };

  useEffect(() => {
    if (validToken && team) {
      fetchNotifications();
    };
  }, [validToken, team]);

  const renderNotificationItem = ({ item }) => {
    return (
      <View style={styles.notificationContainer}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>{formatDate(item?.date)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item?._id?.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  notificationContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Notification;
