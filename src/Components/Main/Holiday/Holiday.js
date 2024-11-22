import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';
import DatePicker from "@react-native-picker/picker";
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const Holiday = () => {
  const { control, handleSubmit, reset } = useForm();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('Holiday');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/holiday/create-holiday', {
        ...data,
        type: selectedType,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Holiday created successfully!');
        reset();
        setSelectedDate('');
        setSelectedType('Holiday');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create holiday. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Holiday</Text>

      {/* Reason Field */}
      <Text style={styles.label}>Reason</Text>
      <Controller
        control={control}
        name="reason"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter reason (optional)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      {/* Type Field */}
      <Text style={styles.label}>Type</Text>
      <Picker
        selectedValue={selectedType}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedType(itemValue)}
      >
        <Picker.Item label="Holiday" value="Holiday" />
        <Picker.Item label="Sunday" value="Sunday" />
      </Picker>

      {/* Date Field */}
      <Text style={styles.label}>Date</Text>
      <Controller
        control={control}
        name="date"
        rules={{ required: 'Date is required' }}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <DatePicker
              style={styles.datePicker}
              date={selectedDate}
              mode="date"
              format="YYYY-MM-DD"
              placeholder="Select date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateInput: styles.dateInput,
              }}
              onDateChange={(date) => {
                setSelectedDate(date);
                onChange(date);
              }}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Create Holiday</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  datePicker: {
    width: '100%',
    marginBottom: 15,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 40,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Holiday;
