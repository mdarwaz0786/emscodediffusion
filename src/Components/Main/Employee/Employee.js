import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import {API_BASE_URL} from "@env";
import {useAuth} from "../../../Context/auth.context.js";
import Icon from "react-native-vector-icons/Feather";

const Employee = ({navigation}) => {
  const {validToken} = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePopupId, setVisiblePopupId] = useState(null);

  // Fetch all employees
  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/all-team`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setEmployees(response?.data?.team);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validToken) {
      fetchAllEmployees();
    }
  }, [validToken]);

  const navigateToAttendance = id => {
    navigation.navigate("Attendance", {id});
  };

  const navigateToSalary = id => {
    navigation.navigate("Salary", {id});
  };

  const handleBackgroundPress = () => {
    setVisiblePopupId(null);
  };

  const renderEmployeeItem = ({item}) => (
    <View style={styles.employeeCard}>
      <View style={styles.heading}>
        <TouchableOpacity
          style={styles.nameRoleContainer}
          onPress={() =>
            setVisiblePopupId(visiblePopupId === item?._id ? null : item?._id)
          }>
          <Text style={styles.employeeName}>{item?.name}</Text>
          <Text style={styles.employeeRole}>{item?.designation?.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() =>
            setVisiblePopupId(visiblePopupId === item?._id ? null : item?._id)
          }>
          <Icon name="more-vertical" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {visiblePopupId === item?._id && (
        <View style={styles.popupMenu}>
          <TouchableOpacity
            onPress={() => {
              setVisiblePopupId(null);
              navigateToAttendance(item?._id);
            }}
            style={styles.popupOption}>
            <Text style={styles.popupOptionText}>Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setVisiblePopupId(null);
              navigateToSalary(item?._id);
            }}
            style={styles.popupOption}>
            <Text style={styles.popupOptionText}>Salary</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

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
        <Text style={styles.headerTitle}>Employee</Text>
      </View>

      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.container}>
          {loading ? (
            <View
              style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
              <ActivityIndicator size="large" color="#A63ED3" />
            </View>
          ) : employees?.length === 0 ? (
            <View style={styles.centeredView}>
              <Text style={styles.noHolidaysText}>Employee not found</Text>
            </View>
          ) : (
            <FlatList
              data={employees}
              renderItem={renderEmployeeItem}
              keyExtractor={item => item?._id}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 100,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    zIndex: 1,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
    marginRight: 10,
  },
  employeeRole: {
    fontSize: 13,
    color: "#888",
  },
  optionsButton: {
    padding: 5,
  },
  popupMenu: {
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5,
    position: "absolute",
    right: 0,
    top: 0,
    right: 60,
    minWidth: 120,
    zIndex: 999,
    height: 60,
    justifyContent: "center",
  },
  popupOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  popupOptionText: {
    fontSize: 14,
    color: "#333",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noHolidaysText: {
    fontSize: 16,
    color: "#888",
  },
});

export default Employee;
