import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LeaveBalanceScreen = () => {
  const [showAllAlloted, setShowAllAlloted] = useState(false);
  const [showAllUsed, setShowAllUsed] = useState(false);
  const navigation = useNavigation();

  const leaveData = {
    allotedLeaveBalance: "2",
    currentLeaveBalance: "2",
    usedLeaveBalance: "0",
    leaveBalanceAllotedHistory: [
      { date: "01-01-2025", alloted: "2" },
      { date: "01-02-2025", alloted: "2" },
      { date: "01-03-2025", alloted: "2" },
      { date: "01-04-2025", alloted: "2" },
    ],
    leaveBalanceUsedHistory: [
      { date: "15-01-2025", reason: "Sick Leave" },
      { date: "20-01-2025", reason: "Personal Work" },
      { date: "25-01-2025", reason: "Personal Reason" },
      { date: "28-01-2025", reason: "Sick Leave" },
    ],
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyRow}>
        <Icon name="date-range" size={20} color="#4caf50" />
        <Text style={styles.historyText}>Date: {item.date}</Text>
      </View>
      {item.alloted ? (
        <View style={styles.historyRow}>
          <Icon name="check-circle" size={20} color="#2196f3" />
          <Text style={styles.historyText}>Alloted: {item.alloted}</Text>
        </View>
      ) : (
        <View style={styles.historyRow}>
          <Icon name="event-note" size={20} color="#f44336" />
          <Text style={styles.historyText}>Reason: {item.reason}</Text>
        </View>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Leave Balance Overview</Text>
      <View style={styles.balanceInfo}>
        <View style={styles.balanceRow}>
          <Icon name="check-circle" size={20} color="#4caf50" />
          <Text style={styles.balanceText}>Total Granted Leaves: {leaveData.allotedLeaveBalance}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Icon name="today" size={20} color="#2196f3" />
          <Text style={styles.balanceText}>Available Leave Balance: {leaveData.currentLeaveBalance}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Icon name="event-available" size={20} color="#f44336" />
          <Text style={styles.balanceText}>Total Leaves Taken: {leaveData.usedLeaveBalance}</Text>
        </View>
      </View>
    </View>
  );

  const renderUsedLeaves = () => (
    <View style={styles.historySection}>
      <Text style={styles.sectionTitle}>Leaves Utilized</Text>
      <FlatList
        data={showAllUsed ? leaveData.leaveBalanceUsedHistory : leaveData.leaveBalanceUsedHistory.slice(0, 2)}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {leaveData.leaveBalanceUsedHistory.length > 2 && !showAllUsed && (
        <TouchableOpacity style={styles.moreButton} onPress={() => setShowAllUsed(true)}>
          <Text style={styles.moreText}>More</Text>
          <Icon name="expand-more" size={20} color="#2196f3" />
        </TouchableOpacity>
      )}
      {showAllUsed && (
        <TouchableOpacity style={styles.moreButton} onPress={() => setShowAllUsed(false)}>
          <Text style={styles.moreText}>Less</Text>
          <Icon name="expand-less" size={20} color="#2196f3" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAllotedLeaves = () => (
    <View style={styles.historySection}>
      <Text style={styles.sectionTitle}>Granted Leaves</Text>
      <FlatList
        data={showAllAlloted ? leaveData.leaveBalanceAllotedHistory : leaveData.leaveBalanceAllotedHistory.slice(0, 2)}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {leaveData.leaveBalanceAllotedHistory.length > 2 && !showAllAlloted && (
        <TouchableOpacity style={styles.moreButton} onPress={() => setShowAllAlloted(true)}>
          <Text style={styles.moreText}>More</Text>
          <Icon name="expand-more" size={20} color="#2196f3" />
        </TouchableOpacity>
      )}
      {showAllAlloted && (
        <TouchableOpacity style={styles.moreButton} onPress={() => setShowAllAlloted(false)}>
          <Text style={styles.moreText}>Less</Text>
          <Icon name="expand-less" size={20} color="#2196f3" />
        </TouchableOpacity>
      )}
    </View>
  );

  const data = [
    { key: 'header' },
    { key: 'usedLeaves' },
    { key: 'allotedLeaves' },
  ];

  const renderItem = ({ item }) => {
    switch (item.key) {
      case 'header':
        return renderHeader();
      case 'usedLeaves':
        return renderUsedLeaves();
      case 'allotedLeaves':
        return renderAllotedLeaves();
      default:
        return null;
    };
  };

  return (
    <>
      <View style={styles.header}>
        <Icon name="arrow-back" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Leave balance</Text>
        <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate("ApplyLeaveRequest")}>
          <Text style={styles.buttonAddText}>Apply Leave</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.container}
      />
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
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  balanceInfo: {
    marginTop: 10,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  balanceText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#555',
  },
  historySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 10,
    color: '#333',
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  historyText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#2196f3',
    alignSelf: 'flex-end',
  },
  moreText: {
    color: '#2196f3',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default LeaveBalanceScreen;