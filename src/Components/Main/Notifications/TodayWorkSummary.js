import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from '../../../Context/refresh.context.js';
import axios from "axios";
import { API_BASE_URL } from "@env";
import formatTimeToHoursMinutes from '../../../Helper/formatTimeToHoursMinutes.js';
import formatTimeWithAmPm from '../../../Helper/formatTimeWithAmPm.js';
import calculateTimeDifference from '../../../Helper/calculateTimeDifference.js';

const TodayWorkSummary = () => {
  const [workSummary, setWorkSummary] = useState([]);
  const { validToken, team } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTodayWorkSummary = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (team?.role?.permissions?.project?.fields?.workDetail?.show) {
      fetchTodayWorkSummary();
    }
  }, [team?.role?.permissions?.project?.fields?.workDetail?.show, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  return (
    <>
      <Text style={styles.title}>Today's Work Summary</Text>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {workSummary && team?.role?.permissions?.project?.fields?.workDetail?.show && (
          loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#ffb300" />
            </View>
          ) : workSummary?.length === 0 ? (
            <Text style={{ flex: 1, textAlign: "center", color: "#777" }}>
              Work summary not found for today.
            </Text>
          ) : (
            workSummary?.map((w) => (
              <View style={styles.card} key={w?.teamMember?._id}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{w?.teamMember?.name?.[0]}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{w?.teamMember?.name}</Text>
                </View>
                <View style={styles.cardContent}>
                  {w?.workDetails?.map((s, index) => (
                    <View style={styles.workDetailContainer} key={index}>
                      <Text style={styles.workDetailText}>
                        <Text style={styles.label}>Project Name: </Text>
                        {s?.projectName}
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
                      <Text style={styles.workDetailText}>
                        <Text style={styles.label}>Work Description: </Text>
                        {s?.workDescription}
                      </Text>
                      {index < w?.workDetails?.length - 1 && <View style={styles.divider} />}
                    </View>
                  ))}
                </View>
              </View>
            )))
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFF',
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
    marginLeft: 10,
  },
  avatar: {
    backgroundColor: '#ffb300',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '400',
  },
  divider: {
    marginTop: 12,
    height: 1,
    backgroundColor: '#DDD',
  },
  workDetailContainer: {
    paddingVertical: 5,
  },
  workDetailText: {
    fontSize: 14,
    marginBottom: 1,
    color: '#555',
  },
  label: {
    fontWeight: '400',
    color: '#333',
    fontSize: 14,
  },
});

export default TodayWorkSummary;
