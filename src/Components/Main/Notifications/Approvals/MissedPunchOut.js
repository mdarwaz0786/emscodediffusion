import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const MissedPunchOut = () => {
  const [compOffRequests, setMissedPunchOuts] = useState([
    {
      _id: '1',
      employee: { name: 'John Doe' },
      attendanceDate: '2025-01-20',
      status: 'Pending',
    },
    {
      _id: '2',
      employee: { name: 'Jane Smith' },
      attendanceDate: '2025-01-21',
      status: 'Approved',
    },
    {
      _id: '3',
      employee: { name: 'Michael Johnson' },
      attendanceDate: '2025-01-22',
      status: 'Rejected',
    },
    {
      _id: '4',
      employee: { name: 'John Doe' },
      attendanceDate: '2025-01-20',
      status: 'Pending',
    },
    {
      _id: '5',
      employee: { name: 'Jane Smith' },
      attendanceDate: '2025-01-21',
      status: 'Approved',
    },
    {
      _id: '6',
      employee: { name: 'Michael Johnson' },
      attendanceDate: '2025-01-22',
      status: 'Rejected',
    },
  ]);

  const handleStatusChange = (requestId, newStatus) => {
    const updatedRequests = compOffRequests.map((request) => request._id === requestId ? { ...request, status: newStatus } : request);
    setMissedPunchOuts(updatedRequests);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.requestItem}>
        <Text style={styles.employeeName}>{item?.employee?.name}</Text>
        <Text style={styles.date}>Comp Off Date: {item?.attendanceDate}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item.status}
            onValueChange={(newStatus) => handleStatusChange(item?._id, newStatus)}
            style={styles.picker}
          >
            <Picker.Item style={styles.pickerItem} label="Pending" value="Pending" />
            <Picker.Item style={styles.pickerItem} label="Approved" value="Approved" />
            <Picker.Item style={styles.pickerItem} label="Rejected" value="Rejected" />
          </Picker>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={compOffRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  requestItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  pickerContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 40,
    justifyContent: "center",
    paddingLeft: 10,
    width: "45%",
  },
  picker: {
    color: "#555",
  },
  pickerItem: {
    fontSize: 14,
  },
});

export default MissedPunchOut;
