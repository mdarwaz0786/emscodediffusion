import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import { API_BASE_URL } from "@env";

const WorkSummary = ({ navigation }) => {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
  const { validToken, team } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchAllProject = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/project/all-project`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        const filteredProject = response?.data?.project?.filter((p) => {
          const isLeader = p?.teamLeader?.some((l) => l?._id === team?._id);
          const isResponsible = p?.responsiblePerson?.some((r) => r?._id === team?._id);
          return isLeader || isResponsible;
        });
        if (team?.role?.name.toLowerCase() === "coordinator" || team?.role?.name.toLowerCase() === "admin") {
          setProjects(response?.data?.project);
        } else {
          setProjects(filteredProject);
        };
      };
    } catch (error) {
      console.error("Error while fetching all projects:", error.message);
    };
  };

  useEffect(() => {
    if (team) {
      fetchAllProject();
    };
  }, [team]);

  console.log(projects)

  // Formatting helper function for time
  const formatTime = (time) => {
    return time.toTimeString().substring(0, 5);
  };

  const handleSubmit = async () => {
    if (!date || !startTime || !endTime) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    const holidayData = {
      type: "Holiday",
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/holiday/create-holiday`,
        holidayData,
        {
          headers: {
            Authorization: validToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        setReason("");
        setDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error:", error);
      Toast.show({ type: "error", text1: error.response?.data?.message || "Submission failed" });
    }
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const showStartTimePicker = () => {
    setIsStartTimePickerVisible(true);
  };

  const showEndTimePicker = () => {
    setIsEndTimePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setIsDatePickerVisible(false);
    setDate(currentDate);
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setIsStartTimePickerVisible(false);
    setStartTime(currentTime);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setIsEndTimePickerVisible(false);
    setEndTime(currentTime);
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
        <Text style={styles.headerTitle}>Work Summary</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Select a Project</Text>

        <Picker
          selectedValue={selectedProject}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedProject(itemValue)}
        >
          <Picker.Item label="Select a project..." value={null} />
          {projects?.map((project) => (
            <Picker.Item key={project?._id} label={project?.projectName} value={project?._id} />
          ))}
        </Picker>

        <Text style={{ marginBottom: 5, color: "#555" }}>
          Date <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* Date Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showDatePicker}
        >
          <Text style={{ color: "#777" }}>{date.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={{ marginBottom: 5, color: "#555" }}>
          Start Time <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* Start Time Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showStartTimePicker}
        >
          <Text style={{ color: "#777" }}>{formatTime(startTime)}</Text>
        </TouchableOpacity>

        {isStartTimePickerVisible && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={onStartTimeChange}
          />
        )}

        <Text style={{ marginBottom: 5, color: "#555" }}>
          End Time <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* End Time Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showEndTimePicker}
        >
          <Text style={{ color: "#777" }}>{formatTime(endTime)}</Text>
        </TouchableOpacity>

        {isEndTimePickerVisible && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={onEndTimeChange}
          />
        )}

        <Text style={{ marginBottom: 5, color: "#555" }}>
          Descripton <Text style={{ color: "red" }}>*</Text>
        </Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter Description"
          placeholderTextColor="#aaa"
          multiline
        />

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
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#777"
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#777",
    borderWidth: 1,
    borderColor: "#fff"
  },
  input: {
    paddingVertical: 5,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#777",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingLeft: 16,
    paddingTop: 10,
  },
  dateInput: {
    paddingVertical: 10,
    paddingLeft: 15,
    color: "#777",
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

export default WorkSummary;
