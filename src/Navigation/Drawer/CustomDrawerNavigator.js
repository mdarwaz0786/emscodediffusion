import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/auth.context.js";
import Logo from "../../Assets/logo.png";

const CustomDrawerNavigator = () => {
  const navigation = useNavigation();
  const { team } = useAuth();
  const fieldPermissions = team?.role?.permissions?.attendance?.fields;

  const drawerItems = [
    {
      label: "Employee",
      icon: "person-outline",
      route: "EmployeeStack",
      resetScreen: "Employee",
      show: fieldPermissions?.employee?.show,
    },
    {
      label: "Holiday",
      icon: "sunny-outline",
      route: "HolidayStack",
      resetScreen: "Holiday",
      show: fieldPermissions?.holiday?.show,
    },
    {
      label: "Settings",
      icon: "settings-outline",
      route: "SettingsStack",
      resetScreen: "Settings",
      show: fieldPermissions?.settings?.show,
    },
    {
      label: "Salary Slip",
      icon: "receipt-outline",
      route: "SalarySlip",
      show: fieldPermissions?.salarySlip?.show,
    },
    {
      label: "Leave Balance",
      icon: "wallet-outline",
      route: "LeaveBalance",
      show: fieldPermissions?.leaveBalance?.show,
    },
    {
      label: "Write Work Summary",
      icon: "create-outline",
      route: "AddWorkSummary",
      show: fieldPermissions?.writeWorkSummary?.show,
    },
    {
      label: "Apply For Leave",
      icon: "calendar-outline",
      route: "ApplyLeaveRequest",
      show: fieldPermissions?.applyLeave?.show,
    },
    {
      label: "Apply For Missed Punch Out",
      icon: "time-outline",
      route: "ApplyMissedPunchOut",
      show: fieldPermissions?.applyMissedPunchOut?.show,
    },
    {
      label: "Apply For Late Punch In",
      icon: "alarm-outline",
      route: "ApplyLatePunchIn",
      show: fieldPermissions?.applyLatePunchIn?.show,
    },
    {
      label: "Apply For Comp Off",
      icon: "briefcase-outline",
      route: "ApplyCompOff",
      show: fieldPermissions?.applyCompOff?.show,
    },
    {
      label: "Project",
      icon: "folder-open-outline",
      route: "ProjectStack",
      show: true,
    },
    {
      label: "Invoice",
      icon: "file-tray-outline",
      route: "InvoiceStack",
      show: true,
    },
    {
      label: "Ticket",
      icon: "chatbubble-outline",
      route: "TicketStack",
      show: true,
    },
    {
      label: "About Us",
      icon: "information-circle-outline",
      route: "About",
      show: fieldPermissions?.aboutUs?.show,
    },
    {
      label: "Contact Us",
      icon: "call-outline",
      route: "Contact",
      show: fieldPermissions?.contactUs?.show,
    },
    {
      label: "Help & Support",
      icon: "help-circle-outline",
      route: "Help",
      show: fieldPermissions?.helpAndSupport?.show,
    },
    {
      label: "Logout",
      icon: "log-out-outline",
      route: "Logout",
      show: true,
    },
  ];

  // Filter drawer items based on the permissions
  const visibleDrawerItems = drawerItems.filter((item) => item.show);

  // Handle navigation
  const handleNavigation = (item) => {
    if (item.resetScreen) {
      navigation.navigate(item.route, { screen: item.resetScreen });
    } else {
      navigation.navigate(item.route);
    };
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={Logo} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.sidebar}>
          {visibleDrawerItems.map((item, index) => (
            <View key={index}>
              <View style={styles.separator} />
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleNavigation(item)}>
                <Icon name={item.icon} size={22} color="#ffb300" />
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
  },
  sidebar: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingVertical: 12,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#777",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
});

export default CustomDrawerNavigator;
