import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const CreateHolidayForm = () => {
  const [reason, setReason] = useState('');
  const [type, setType] = useState('Holiday');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSubmit = async () => {
    if (!reason || !date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];

    const holidayData = {
      reason,
      type,
      date: formattedDate,
    };

    try {
      await axios.post(
        'http://localhost:8080/api/v1/holiday/create-holiday',
        holidayData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      Alert.alert('Success', 'Holiday created successfully!');
      // Reset form
      setReason('');
      setType('Holiday');
      setDate(new Date());
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to create holiday');
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

  const menuOptions = ['Holiday', 'Sunday'];

  const handleOutsideClick = () => {
    setDropdownVisible(false);
    Keyboard.dismiss(); // Optional, hides keyboard if it's open
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Holiday</Text>

        {/* Reason Input */}
        <TextInput
          placeholder="Enter reason"
          value={reason}
          onChangeText={setReason}
          style={styles.input}
        />

        {/* Dropdown for Type */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.dropdownText}>{type}</Text>
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdown}>
              <FlatList
                data={menuOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setType(item);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Date Picker */}
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200ee',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  dropdownText: {
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    zIndex: 1,
    elevation: 3,
    width: '30%',
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
});

export default CreateHolidayForm;
