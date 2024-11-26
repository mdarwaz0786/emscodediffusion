import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import axios from 'axios';
import { useAuth } from '../../../Context/auth.context.js';

const AddHoliday = ({ navigation }) => {
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const { validToken } = useAuth();

  const handleSubmit = async () => {
    if (!reason || !date) {
      Toast.show({ type: "error", text1: "Please fill in all fields" });
      return;
    };

    const formattedDate = date.toISOString().split('T')[0];

    const holidayData = {
      reason,
      type: 'Holiday',
      date: formattedDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/holiday/create-holiday`,
        holidayData,
        {
          headers: {
            Authorization: validToken,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response?.data?.success) {
        Toast.show({ type: "success", text1: "Holiday added successfully" });
        setReason('');
        setDate(new Date());
      }
    } catch (error) {
      console.error('Error:', error);
      Toast.show({ type: "error", text1: error.response.data.message });
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

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
        <Text style={styles.headerTitle}>Add Holiday</Text>
      </View>

      <View style={styles.container}>
        {/* Reason Input */}
        <TextInput
          placeholder="Enter reason"
          value={reason}
          onChangeText={setReason}
          style={styles.input}
        />

        {/* Holiday Input */}
        <TextInput
          value="Holiday"
          editable={false}
          style={styles.input}
        />

        {/* Date Picker */}
        <TouchableOpacity style={[styles.input, styles.dateInput]} onPress={showDatePicker}>
          <Text>{date.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 22,
  },
  input: {
    padding: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: "#777",
  },
  dateInput: {
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: '#A63ED3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default AddHoliday;
