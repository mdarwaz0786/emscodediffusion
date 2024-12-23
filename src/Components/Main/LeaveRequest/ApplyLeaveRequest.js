import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import { API_BASE_URL } from "@env";

const ApplyLeaveRequest = ({ navigation }) => {
  const [reason, setReason] = useState();
  const [selectedLeaveType, setSelectedLeaveType] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const { validToken, team } = useAuth();

  const showStartDatePicker = () => {
    setIsStartDatePickerVisible(true);
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setIsStartDatePickerVisible(false);
    setStartDate(currentDate);
  };

  const showEndDatePicker = () => {
    setIsEndDatePickerVisible(true);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setIsEndDatePickerVisible(false);
    setEndDate(currentDate);
  };

  const leaveTypes = [
    "Sick Leave",          // For health-related absences
    "Casual Leave",        // For personal or short-term unexpected reasons
    "Earned Leave",        // Accumulated leave earned based on days worked
    "Annual Leave",        // For planned vacations or personal time off
    "Maternity Leave",     // For childbirth and postnatal care (applicable to mothers)
    "Paternity Leave",     // For fathers to support after childbirth
    "Parental Leave",      // For non-birth-parent caretaking responsibilities
    "Bereavement Leave",   // For attending to family or close friend loss
    "Wedding Leave",       // For an employee's wedding
    "Relocation Leave",    // For moving to a new location
    "Emergency Leave",     // Emergencies requiring immediate leave
    "Other",               // Remaining leave
  ];

  const handleSubmit = async () => {
    if (!startDate || !endDate || !selectedLeaveType || !reason) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    };

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/leaveApproval/create-leaveApproval`,
        { employee: team?._id, leaveType: selectedLeaveType, startDate: formattedStartDate, endDate: formattedEndDate, reason },
        {
          headers: {
            Authorization: validToken,
          },
        }
      );

      if (response?.data?.success) {
        setReason();
        setStartDate(new Date());
        setEndDate(new Date());
        setSelectedLeaveType();
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error while applying leave:", error.message);
      Toast.show({ type: "error", text1: error?.response?.data?.message || "Submission failed" });
    };
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
        <Text style={styles.headerTitle}>Apply Leave</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={{ marginBottom: 5, color: "#555" }}>
          Leave Type <Text style={{ color: "red" }}>*</Text>
        </Text>
        <Picker
          selectedValue={selectedLeaveType}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedLeaveType(itemValue)}
        >
          <Picker.Item
            label="Select Leave Type"
            value={null}
            style={styles.pickerItem}
          />
          {leaveTypes?.map((leave, index) => (
            <Picker.Item
              key={index}
              label={leave}
              value={leave}
              style={styles.pickerItem}
            />
          ))}
        </Picker>

        <Text style={{ marginBottom: 5, color: "#555" }}>
          From <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* Start Date Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showStartDatePicker}
        >
          <Text style={{ color: "#777" }}>{startDate.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {isStartDatePickerVisible && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        <Text style={{ marginBottom: 5, color: "#555" }}>
          To <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* End Date Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showEndDatePicker}
        >
          <Text style={{ color: "#777" }}>{endDate.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {isEndDatePickerVisible && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}

        {/* Reason */}
        <Text style={{ marginBottom: 5, color: "#555" }}>
          Reason <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write leave reason"
          placeholderTextColor="#777"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 100, marginBottom: 20, color: "#555" }}>
          <Text style={{ color: "red" }}>*</Text> Note: For single day leave select same date in From and To.
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",

    zIndex: 1000,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  picker: {
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#777",
    borderWidth: 1,
    borderColor: "#fff",
  },
  pickerItem: {
    backgroundColor: "#fff",
    color: "#555",
    fontSize: 14,
  },
  input: {
    height: 50,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#777",
    justifyContent: "center"
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  dateInput: {
    paddingVertical: 10,
    paddingLeft: 15,
  },
  submitButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default ApplyLeaveRequest;
