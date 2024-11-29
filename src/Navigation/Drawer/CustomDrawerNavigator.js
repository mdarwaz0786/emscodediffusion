import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/auth.context.js";

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
      label: "About Us",
      icon: "information-circle-outline",
      route: "About",
      show: true,
    },
    {
      label: "Contact Us",
      icon: "call-outline",
      route: "Contact",
      show: true,
    },
    {
      label: "Help",
      icon: "help-circle-outline",
      route: "Help",
      show: true,
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
      const routes = [
        { name: item.route, params: { screen: item.resetScreen } },
      ];

      // Dynamic index calculation
      const targetIndex = routes.findIndex((route) => route.name === item.route && route.params?.screen === item.resetScreen);

      navigation.dispatch(
        CommonActions.reset({
          index: targetIndex,
          routes,
        })
      );
    } else {
      navigation.navigate(item.route);
    };
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Employee Management System</Text>
      </View>
      <View style={styles.sidebar}>
        {visibleDrawerItems.map((item, index) => (
          <Pressable
            key={index}
            style={styles.item}
            onPress={() => handleNavigation(item)}>
            <Icon name={item.icon} size={22} color="#A63ED3" />
            <Text style={styles.itemText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    padding: 16,
    backgroundColor: "#A63ED3",
  },
  headerText: {
    fontSize: 16,
    color: "#fff",
  },
  sidebar: {
    flex: 1,
    paddingTop: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 15,
  },
});

export default CustomDrawerNavigator;
