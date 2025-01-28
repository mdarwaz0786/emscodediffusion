import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../../Context/auth.context.js';
import axios from 'axios';
import { API_BASE_URL } from "@env";
import formatDate from '../../../Helper/formatDate.js';

const LeaveBalanceScreen = () => {
  const { validToken, team } = useAuth();
  const [showAllAlloted, setShowAllAlloted] = useState(false);
  const [showAllUsed, setShowAllUsed] = useState(false);
  const [showAllLeaves, setShowAllLeaves] = useState(false);
  const [employee, setEmployee] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [employeeId, setEmployeeId] = useState(team?._id);
  const navigation = useNavigation();

  useEffect(() => {
    if (team) {
      setEmployeeId(team?._id);
    };
  }, [team]);

  const fetchSingleEmployee = async (employeeId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/team/single-team/${employeeId}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setEmployee(response?.data?.team);
      }
    } catch (error) {
      console.log(error.message);
    };
  };

  const fetchApprovedLeaves = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/leaveApproval/all-leaveApproval`,
        {
          params: { employeeId },
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setLeaves(response?.data?.data);
      }
    } catch (error) {
      console.log(error.message);
    };
  };

  useEffect(() => {
    if (validToken && employeeId) {
      fetchApprovedLeaves();
      fetchSingleEmployee(employeeId);
    };
  }, [validToken, employeeId]);

  const renderHeader = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Leave Balance Overview</Text>
      <View style={styles.balanceInfo}>
        <View style={styles.balanceRow}>
          <Icon name="check-circle" size={20} color="#4caf50" />
          <Text style={styles.balanceText}>Total Granted Leaves: {employee?.allotedLeaveBalance}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Icon name="today" size={20} color="#2196f3" />
          <Text style={styles.balanceText}>Available Leave Balance: {employee?.currentLeaveBalance}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Icon name="event-available" size={20} color="#f44336" />
          <Text style={styles.balanceText}>Total Leaves Taken: {employee?.usedLeaveBalance}</Text>
        </View>
      </View>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyRow}>
        <Icon name="date-range" size={20} color="#4caf50" />
        <Text style={styles.historyText}>Date: {item.date}</Text>
      </View>
      {item.alloted ? (
        <View style={styles.historyRow}>
          <Icon name="check-circle" size={20} color="#2196f3" />
          <Text style={styles.historyText}>Alloted: {item?.alloted}</Text>
        </View>
      ) : (
        <View style={styles.historyRow}>
          <Icon name="event-note" size={20} color="#f44336" />
          <Text style={styles.historyText}>Reason: {item?.reason}</Text>
        </View>
      )}
    </View>
  );

  const renderUsedLeaves = () => (
    <View style={styles.historySection}>
      {
        employee?.leaveBalanceUsedHistory?.length > 0 && (
          <Text style={styles.sectionTitle}>Leaves Utilized</Text>
        )
      }
      <FlatList
        data={showAllUsed ? employee?.leaveBalanceUsedHistory : employee?.leaveBalanceUsedHistory?.slice(0, 2)}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {employee?.leaveBalanceUsedHistory?.length > 2 && !showAllUsed && (
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
      {
        employee?.leaveBalanceAllotedHistory?.length > 0 && (
          <Text style={styles.sectionTitle}>Granted Leaves</Text>
        )
      }
      <FlatList
        data={showAllAlloted ? employee?.leaveBalanceAllotedHistory : employee?.leaveBalanceAllotedHistory?.slice(0, 2)}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {employee?.leaveBalanceAllotedHistory?.length > 2 && !showAllAlloted && (
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

  const renderApprovedLeaves = () => (
    <View style={styles.historySection}>
      {leaves?.length > 0 && (
        <Text style={styles.sectionTitle}>Approved Leaves</Text>
      )}
      <FlatList
        data={showAllLeaves ? leaves : leaves?.slice(0, 2)}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View style={styles.historyRow}>
              <Icon name="event" size={20} color="#4caf50" />
              <Text style={styles.historyText}>
                From {formatDate(item?.startDate)} to {formatDate(item?.endDate)}
              </Text>
            </View>
            <View style={styles.historyRow}>
              <Icon name="person" size={20} color="#2196f3" />
              <Text style={styles.historyText}>
                Approved By: {item?.leaveApprovedBy?.name || "N/A"}
              </Text>
            </View>
            <View style={styles.historyRow}>
              <Icon name="info" size={20} color={item?.leaveStatus === "Approved" ? "#4caf50" : "#f44336"} />
              <Text style={styles.historyText}>
                Status: {item?.leaveStatus}
              </Text>
            </View>
            {item?.reason && (
              <View style={styles.historyRow}>
                <Icon name="comment" size={20} color="#757575" />
                <Text style={styles.historyText}>Reason: {item?.reason}</Text>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {leaves?.length > 2 && !showAllLeaves && (
        <TouchableOpacity style={styles.moreButton} onPress={() => setShowAllLeaves(true)}>
          <Text style={styles.moreText}>More</Text>
          <Icon name="expand-more" size={20} color="#2196f3" />
        </TouchableOpacity>
      )}
      {showAllLeaves && (
        <TouchableOpacity style={styles.moreButton} onPress={() => setShowAllLeaves(false)}>
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
    { key: 'approvedLeaves' },
  ];

  const renderItem = ({ item }) => {
    switch (item.key) {
      case 'header':
        return renderHeader();
      case 'usedLeaves':
        return renderUsedLeaves();
      case 'allotedLeaves':
        return renderAllotedLeaves();
      case 'approvedLeaves':
        return renderApprovedLeaves();
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