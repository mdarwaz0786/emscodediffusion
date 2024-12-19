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

const AddWorkSummary = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [workDescription, setWorkDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
  const { validToken, team } = useAuth();

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
      console.log("Error while fetching all projects:", error.message);
    };
  };

  useEffect(() => {
    if (team) {
      fetchAllProject();
    };
  }, [team]);

  // Format time
  const formatTime = (time) => {
    return time.toTimeString().substring(0, 5);
  };

  const handleSubmit = async () => {
    if (!date || !startTime || !endTime || !selectedProject || !workDescription) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    };

    const formattedDate = date.toISOString().split("T")[0];
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    const workDetail = [{
      teamMember: team?._id,
      workDescription,
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    }];

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/project/update-project/${selectedProject}`,
        { workDetail },
        {
          headers: {
            Authorization: validToken,
          },
        }
      );

      if (response?.data?.success) {
        setWorkDescription("");
        setDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
        setSelectedProject(null);
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error:", error.message);
      Toast.show({ type: "error", text1: error?.response?.data?.message || "Submission failed" });
    };
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
        <Text style={styles.headerTitle}>Add Daily Work Summary</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={{ marginBottom: 5, color: "#555" }}>
          Project <Text style={{ color: "red" }}>*</Text>
        </Text>
        <Picker
          selectedValue={selectedProject}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedProject(itemValue)}
        >
          <Picker.Item
            label="Select project"
            value={null}
            style={styles.pickerItem}
          />
          {projects?.map((project) => (
            <Picker.Item
              key={project?._id}
              label={project?.projectName}
              value={project?._id}
              style={styles.pickerItem}
            />
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

        {/* Description */}
        <Text style={{ marginBottom: 5, color: "#555" }}>
          Work Descripton <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter Work Description"
          placeholderTextColor="#777"
          value={workDescription}
          onChangeText={setWorkDescription}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    marginBottom: 10,
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
    marginBottom: 10,
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

export default AddWorkSummary;
