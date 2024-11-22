import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationScreen = () => {
  const [notifications] = useState([
    {
      id: '1',
      title: 'Upcoming Holiday',
      description: 'The office will be closed on 25th December for Christmas.',
      date: '2024-12-25',
      icon: 'calendar',
    },
    {
      id: '2',
      title: 'Important Notice',
      description: 'Please submit your timesheets before the end of the week.',
      date: '2024-11-22',
      icon: 'information',
    },
    {
      id: '3',
      title: 'Holiday Reminder',
      description: 'New Year’s Day holiday on 1st January.',
      date: '2025-01-01',
      icon: 'calendar-check',
    },
  ]);

  // Render each notification item
  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.cardHeader}>
        <Icon name={item.icon} size={22} color="#A63ED3" style={styles.icon} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    color: '#333',
    marginBottom: 16,
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
});

export default NotificationScreen;
