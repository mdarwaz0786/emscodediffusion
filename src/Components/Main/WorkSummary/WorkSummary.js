import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import Icon from "react-native-vector-icons/Feather";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import { API_BASE_URL } from "@env";
import formatTimeToHoursMinutes from '../../../Helper/formatTimeToHoursMinutes.js';
import formatTimeWithAmPm from '../../../Helper/formatTimeWithAmPm.js';
import calculateTimeDifference from '../../../Helper/calculateTimeDifference.js';

const WorkSummary = () => {
  const [workSummary, setWorkSummary] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const { validToken, team } = useAuth();

  const fetchTodayWorkSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/project/work-detail`, {
        headers: {
          Authorization: validToken,
        },
        params: {
          date: new Date().toISOString().split("T")[0],
        },
      });

      if (response?.data?.success) {
        setWorkSummary(response?.data?.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (team?.role?.permissions?.project?.fields?.workDetail?.show) {
      fetchTodayWorkSummary();
    }
  }, [team?.role?.permissions?.project?.fields?.workDetail?.show]);

  const toggleExpand = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
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
        <Text style={styles.headerTitle}>Today's Work Summary</Text>
      </View>

      <ScrollView style={styles.container}>
        {workSummary && team?.role?.permissions?.project?.fields?.workDetail?.show && (
          <View>
            {workSummary?.map((w) => (
              <Card style={styles.card} key={w?.teamMember?._id}>
                <TouchableOpacity onPress={() => toggleExpand(w?.teamMember?._id)}>
                  <Card.Title
                    title={w?.teamMember?.name}
                    titleStyle={styles.cardTitle}
                    left={() => (
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{w?.teamMember?.name?.[0]}</Text>
                      </View>
                    )}
                  />
                </TouchableOpacity>
                {expandedCardId === w?.teamMember?._id && (
                  <Card.Content>
                    <Divider style={styles.divider} />
                    {w?.workDetails?.map((s, index) => (
                      <View style={styles.workDetailContainer} key={index}>
                        <Text style={styles.workDetailText}>
                          <Text style={styles.label}>Project Name: </Text>
                          {s?.projectName}
                        </Text>
                        <Text style={styles.workDetailText}>
                          <Text style={styles.label}>Work Description: </Text>
                          {s?.workDescription}
                        </Text>
                        <Text style={styles.workDetailText}>
                          <Text style={styles.label}>Start Time: </Text>
                          {formatTimeWithAmPm(s?.startTime)}
                        </Text>
                        <Text style={styles.workDetailText}>
                          <Text style={styles.label}>End Time: </Text>
                          {formatTimeWithAmPm(s?.endTime)}
                        </Text>
                        <Text style={styles.workDetailText}>
                          <Text style={styles.label}>Spent Hours: </Text>
                          {formatTimeToHoursMinutes(calculateTimeDifference(s?.startTime, s?.endTime))}
                        </Text>
                        {index < w?.workDetails?.length - 1 && <Divider style={styles.subDivider} />}
                      </View>
                    ))}
                  </Card.Content>
                )}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 60,
    padding: 16,
    backgroundColor: "#fff",
    elevation: 50,
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 0,
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginLeft: -15,
  },
  avatar: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    marginBottom: 5,
    marginTop: -10,
    height: 1,
    backgroundColor: '#CCC',
  },
  subDivider: {
    marginTop: 12,
    height: 1,
    backgroundColor: '#DDD',
  },
  workDetailContainer: {
    paddingVertical: 7,
  },
  workDetailText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  label: {
    fontWeight: '500',
    color: '#333',
  },
});


export default WorkSummary;
