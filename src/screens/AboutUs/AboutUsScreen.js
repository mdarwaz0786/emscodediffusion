import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/Feather";

const AboutUsScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../Assets/company-banner.jpg")}
            style={styles.banner}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <Text style={styles.subHeader}>Who We Are ?</Text>
        <Text style={styles.text}>
          We are a passionate team of developers and designers dedicated to
          delivering high-quality web solutions tailored to your business needs.
          Our mission is to create impactful digital experiences that help
          businesses thrive in the online world.
        </Text>

        <Text style={styles.subHeader}>Our Values</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>🌟 Innovation</Text>
          <Text style={styles.listItem}>🤝 Collaboration</Text>
          <Text style={styles.listItem}>🚀 Excellence</Text>
          <Text style={styles.listItem}>📈 Growth</Text>
        </View>

        <Text style={styles.subHeader}>What We Offer ?</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>💻 Custom Web Development</Text>
          <Text style={styles.listItem}>📱 Mobile-Friendly Design</Text>
          <Text style={styles.listItem}>🔍 SEO Optimization</Text>
          <Text style={styles.listItem}>📊 E-Commerce Solutions</Text>
          <Text style={styles.listItem}>🔧 Maintenance & Support</Text>
        </View>

        <Text style={styles.subHeader}>Our Team</Text>
        <Text style={styles.text}>
          Our talented team consists of skilled developers, creative designers,
          and strategic project managers, all working collaboratively to deliver
          the best results for your projects.
        </Text>

        <Text style={styles.subHeader}>Our History</Text>
        <Text style={styles.text}>
          Established in 2015, we have spent over a decade building a reputation
          for exceptional service and innovative solutions. From small startups
          to established enterprises, we've been a part of many success stories.
        </Text>

        <Text style={styles.footer}>
          Ready to transform your vision into reality? Let's build something
          amazing together!
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 100,
    padding: 12,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  bannerContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: -10,
  },
  banner: {
    width: "115%",
    height: 130,
    resizeMode: "contain",
  },
  subHeader: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 10,
    textAlign: "justify",
  },
  list: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  footer: {
    fontSize: 14,
    color: "#555",
    fontWeight: "400",
    marginTop: 10,
  },
});

export default AboutUsScreen;
