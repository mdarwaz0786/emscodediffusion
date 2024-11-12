import React from "react";
import {View, Text, StyleSheet, ScrollView, Pressable} from "react-native";
import {useNavigation} from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import {useAuth} from "../../Context/auth.context.js";

const CustomDrawerNavigator = () => {
  const navigation = useNavigation();
  const {isLoggedIn, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color="#A63ED3" />
      </View>
    );
  }

  const drawerItems = isLoggedIn
    ? [
        {
          label: "Home",
          icon: "home-outline",
          route: "Home",
        },
        {
          label: "Profile",
          icon: "person-outline",
          route: "Profile",
        },
        {
          label: "Settings",
          icon: "settings-outline",
          route: "Settings",
        },
        {
          label: "Notifications",
          icon: "notifications-outline",
          route: "Notifications",
        },
        {
          label: "About Us",
          icon: "information-circle-outline",
          route: "About",
        },
        {
          label: "Contact Us",
          icon: "call-outline",
          route: "Contact",
        },
        {
          label: "Help",
          icon: "help-circle-outline",
          route: "Help",
        },
        {
          label: "Logout",
          icon: "log-out-outline",
          route: "Logout",
        },
      ]
    : [
        {
          label: "Login",
          icon: "log-in-outline",
          route: "Login",
        },
      ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Employee Management System</Text>
      </View>
      <View style={styles.sidebar}>
        {drawerItems.map((item, index) => (
          <Pressable
            key={index}
            style={styles.item}
            onPress={() => navigation.navigate(item.route)}>
            <Icon name={item.icon} size={24} color="#A63ED3" />
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
    fontSize: 17,
    color: "#fff",
  },
  sidebar: {
    flex: 1,
    paddingTop: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CustomDrawerNavigator;
