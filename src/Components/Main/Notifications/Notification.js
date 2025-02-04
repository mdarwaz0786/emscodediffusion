import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from "@env";
import { useAuth } from '../../../Context/auth.context.js';
import formatDate from '../../../Helper/formatDate.js';
import { useRefresh } from '../../../Context/refresh.context.js';
import { ActivityIndicator } from 'react-native-paper';

const Notification = () => {
  const { validToken, team } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshKey, refreshPage } = useRefresh();

  const fetchNotifications = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (validToken && team) {
      fetchNotifications();
    };
  }, [validToken, team, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const renderNotificationItem = ({ item }) => {
    return (
      <View style={styles.notificationContainer}>
        <Text style={styles.message}>{item?.message}</Text>
        <Text style={styles.date}>{formatDate(item?.date)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="small" color="#ffb300" />
        </View>
      ) : notifications?.length === 0 ? (
        <View style={styles.centeredView}>
          <Text style={styles.notFoundText}>No notifications available.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item?._id?.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No notifications available.</Text>}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
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
  notFoundText: {
    fontSize: 14,
    color: "#777",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Notification;
