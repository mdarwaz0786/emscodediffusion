import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const CreateHoliday = () => {
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
      <View style={styles.headerContainer}>
        <Icon name="person-outline" size={28} color="#007BFF" />
        <Text style={styles.header}>Create Holiday</Text>
      </View>

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

      <Text style={styles.label}>Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Holiday" value="Holiday" />
          <Picker.Item label="Sunday" value="Sunday" />
        </Picker>
      </View>

      <Text style={styles.label}>Date</Text>

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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
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
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 40,
    width: '100%',
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

export default CreateHoliday;
