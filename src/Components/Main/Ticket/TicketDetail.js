import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { Chip } from "react-native-paper";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import { RefreshControl } from "react-native-gesture-handler";
import { API_BASE_URL } from "@env";

const getStatusColor = (status) => {
  switch (status) {
    case "Open": return "#dc3545";
    case "In Progress": return "#ffc107";
    case "Resolved": return "#28a745";
    case "Closed": return "#6c757d";
    default: return "#007bff";
  };
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low": return "#28a745";
    case "Medium": return "#ffc107";
    case "High": return "#dc3545";
    default: return "#007bff";
  };
};

const getTicketTypeColor = (ticketType) => {
  switch (ticketType) {
    case "Bug": return "#dc3545";
    case "Feature Request": return "#17a2b8";
    case "Improvement": return "#28a745";
    case "Task": return "#007bff";
    case "Support": return "#ffc107";
    case "Incident": return "#6c757d";
    default: return "#f8f9fa";
  };
};

const TicketDetail = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params;
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [ticket, setTicket] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async (id) => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/api/v1/ticket/single-ticket/${id}`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setTicket(response?.data?.ticket);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (id && validToken) {
      fetchTicket(id);
    };
  }, [id, validToken, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ffb300" />
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Ticket Detail</Text>
      </View>

      {
        !ticket ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ textAlign: "center", color: "#333" }}>No ticket.</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }>

            <Text style={styles.heading}>🎫 Ticket Details</Text>

            <View style={[styles.infoContainer, { flexDirection: "row" }]}>
              <Text style={styles.label}>Ticket ID: </Text>
              <Text style={styles.value}>{ticket?.ticketId}</Text>
            </View>

            <View style={[styles.infoContainer, { flexDirection: "row" }]}>
              <Text style={styles.label}>Ticket Status: </Text>
              <View style={[styles.statusContainer, { backgroundColor: getStatusColor(ticket?.status) }]}>
                <Text style={styles.statusText}>{ticket?.status}</Text>
              </View>
            </View>

            <View style={[styles.infoContainer, { flexDirection: "row" }]}>
              <Text style={styles.label}>Ticket Priority: </Text>
              <View style={[styles.statusContainer, { backgroundColor: getPriorityColor(ticket?.priority) }]}>
                <Text style={styles.statusText}>{ticket?.priority}</Text>
              </View>
            </View>

            <View style={[styles.infoContainer, { flexDirection: "row" }]}>
              <Text style={styles.label}>Ticket Type: </Text>
              <View style={[styles.statusContainer, { backgroundColor: getTicketTypeColor(ticket?.ticketType) }]}>
                <Text style={styles.statusText}>{ticket?.ticketType}</Text>
              </View>
            </View>

            <View style={[styles.infoContainer, { flexDirection: "row" }]}>
              <Text style={styles.label}>Project Name: </Text>
              <Text style={styles.value}>{ticket?.project?.projectName}</Text>
            </View>

            <View style={[styles.infoContainer, { flexDirection: "row" }]}>
              <Text style={styles.label}>Raised By: </Text>
              <Text style={styles.value}>{ticket?.createdBy?.name}</Text>
            </View>

            <View style={[styles.infoContainer, { flexDirection: "row" }]}>
              <Text style={styles.label}>Title: </Text>
              <Text style={styles.title}>{ticket?.title}</Text>
            </View>

            <View style={[styles.infoContainer, { flexDirection: "row" }]}>
              <Text style={styles.label}>Description: </Text>
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
            <Text style={styles.dateText}>📅 Last Updated: {new Date(ticket?.updatedAt).toLocaleString()}</Text>

            {ticket?.image && (
              <View style={styles.imageContainer}>
                <Text style={styles.label}>Attachment:</Text>
                <Image source={{ uri: ticket?.image }} style={styles.image} />
              </View>
            )}
          </ScrollView>
        )
      }
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
    padding: 20,
  },
  loaderContainer: {
    flex: 1, justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007bff",
    marginBottom: 20,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: 5,
  },
  statusText: {
    color: "#fff",
    fontWeight: "500",
  },
  infoContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007bff",
  },
  description: {
    fontSize: 14,
    color: "#6c757d",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 5,
  },
  chip: {
    margin: 5,
    backgroundColor: "#555",
  },
  dateText: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
  },
});

export default TicketDetail;
