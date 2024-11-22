import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../Context/auth.context.js";
import formatTimeToHoursMinutes from "../../Helper/formatTimeToHoursMinutes.js";
import formatDate from "../../Helper/formatDate.js";

const ProfileScreen = () => {
  const { team } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.name}>{team?.name}</Text>
        <Text style={styles.designation}>{team?.designation?.name || "Designation not assigned"}</Text>
      </View>

      {/* Additional Info */}
      <View style={styles.infoCard}>
        <DetailRow label="Employee ID" value={team?.employeeId} />
        <DetailRow label="Email" value={team?.email} />
        <DetailRow label="Mobile" value={team?.mobile} />
        <DetailRow label="Joining Date" value={formatDate(team?.joining)} />
        <DetailRow label="Date of Birth" value={formatDate(team?.dob)} />
        <DetailRow label="Monthly Salary" value={`₹${team?.monthlySalary}`} />
        <DetailRow label="Working Hours/Day" value={formatTimeToHoursMinutes(team?.workingHoursPerDay)} />
        <DetailRow label="Role" value={team?.role?.name || "Role not assigned"} />
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || "Not available"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  name: {
    fontSize: 15,
    fontWeight: "400",
    color: "#343a40",
  },
  designation: {
    fontSize: 14,
    color: "#6c757d",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#495057",
  },
  detailValue: {
    fontSize: 14,
    color: "#495057",
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 0,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "400",
  },
});

export default ProfileScreen;

