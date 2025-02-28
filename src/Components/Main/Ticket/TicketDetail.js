import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Button, Chip } from "react-native-paper";

const base_url = "YOUR_API_BASE_URL";

const getStatusColor = (status) => {
  switch (status) {
    case "Open": return "#dc3545";
    case "In Progress": return "#ffc107";
    case "Resolved": return "#28a745";
    case "Closed": return "#6c757d";
    default: return "#007bff";
  }
};

const SingleTicketS = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`${base_url}/api/v1/ticket/single-ticket/${id}`);
        if (response.data.success) {
          setTicket(response.data.ticket);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎫 Ticket Details</Text>

      <View style={[styles.statusContainer, { backgroundColor: getStatusColor(ticket?.status) }]}>
        <Text style={styles.statusText}>{ticket?.status}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Ticket ID:</Text>
        <Text style={styles.value}>{ticket?.ticketId}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Project Name:</Text>
        <Text style={styles.value}>{ticket?.project?.projectName}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Raised By:</Text>
        <Text style={styles.value}>{ticket?.createdBy?.name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Title:</Text>
        <Text style={styles.title}>{ticket?.title}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.description}>{ticket?.description}</Text>
      </View>

      <Text style={styles.label}>Assigned To:</Text>
      <View style={styles.chipContainer}>
        {ticket?.assignedTo?.length > 0 ? (
          ticket?.assignedTo?.map((member, index) => (
            <Chip key={index} style={styles.chip}>{member?.name}</Chip>
          ))
        ) : (
          <Text style={styles.value}>Not Assigned</Text>
        )}
      </View>

      <Text style={styles.dateText}>📅 Created At: {new Date(ticket?.createdAt).toLocaleString()}</Text>
      <Text style={styles.dateText}>⏱ Last Updated: {new Date(ticket?.updatedAt).toLocaleString()}</Text>

      {ticket?.image && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Attachment:</Text>
          <Image source={{ uri: ticket.image }} style={styles.image} />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
          Back
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 22, fontWeight: "bold", color: "#007bff", marginBottom: 20 },
  statusContainer: { padding: 8, borderRadius: 5, alignSelf: "flex-start", marginBottom: 15 },
  statusText: { color: "#fff", fontWeight: "bold" },
  infoContainer: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold", color: "#6c757d" },
  value: { fontSize: 18, fontWeight: "bold", color: "#343a40" },
  title: { fontSize: 20, fontWeight: "bold", color: "#007bff" },
  description: { fontSize: 16, color: "#6c757d" },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginVertical: 5 },
  chip: { margin: 5, backgroundColor: "#e9ecef" },
  dateText: { fontSize: 14, color: "#6c757d", marginTop: 5 },
  imageContainer: { alignItems: "center", marginTop: 20 },
  image: { width: 300, height: 200, resizeMode: "contain", borderRadius: 10 },
  buttonContainer: { marginTop: 20 },
  backButton: { backgroundColor: "#007bff" },
});

export default TicketDetail;
