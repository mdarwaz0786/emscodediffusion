import React from "react";
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";

const Service = () => {
  const handleContactPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Our Services</Text>
        <Text style={styles.headerSubtitle}>Innovative & Scalable Digital Solutions</Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/web-development.jpg")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Custom Website Development</Text>
        <Text style={styles.serviceDescription}>
          We specialize in designing and developing fully customized websites tailored to your business needs. Our web solutions are built using cutting-edge technologies like React, Angular, Next.js, and Vue.js, ensuring optimal performance, scalability, and security. Whether you need a corporate website, an eCommerce store, or a personal portfolio, we deliver visually appealing and high-performing solutions.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/mobile-app.jpg")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Mobile App Development (iOS & Android)</Text>
        <Text style={styles.serviceDescription}>
          Our mobile app development services focus on creating high-quality, user-friendly, and efficient applications for both iOS and Android platforms. We leverage frameworks like React Native and Flutter to develop cross-platform apps that provide a seamless experience. From startup MVPs to enterprise-level applications, we ensure feature-rich, scalable, and engaging mobile solutions.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/ui-ux.png")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>UI/UX Design & Branding</Text>
        <Text style={styles.serviceDescription}>
          A compelling design is key to user engagement. Our UI/UX design team creates intuitive, modern, and visually appealing interfaces that enhance user experience and reinforce brand identity. We focus on wireframing, prototyping, usability testing, and branding to ensure a smooth and interactive user journey for your digital product.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/cloud-backend.png")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Cloud & Backend Solutions</Text>
        <Text style={styles.serviceDescription}>
          Our backend development services focus on building scalable and secure server-side applications using modern frameworks like Node.js, PHP, and databases such as MongoDB and MySQL. We also provide cloud-based solutions leveraging AWS, Firebase, and Google Cloud to ensure high availability, robust security, and seamless performance.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/digital-marketing.png")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Digital Marketing & SEO</Text>
        <Text style={styles.serviceDescription}>
          Enhance your online presence and drive business growth with our digital marketing and SEO services. We specialize in keyword optimization, content marketing, pay-per-click (PPC) advertising, social media marketing, and analytics-driven strategies. Our goal is to increase traffic, boost engagement, and improve conversions through data-driven campaigns.
        </Text>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Get in Touch</Text>
        <TouchableOpacity onPress={() => handleContactPress('mailto:info@codediffusion.in')}>
          <Text style={styles.contactText}>📩 info@codediffusion.in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleContactPress('tel:+91-7827114607')}>
          <Text style={styles.contactText}>📞 +91-7827114607</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleContactPress('https://www.codediffusion.in')}>
          <Text style={styles.contactText}>🌍 www.codediffusion.in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#2c3e50",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#d1d1d1",
  },
  serviceSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: 200,
    resizeMode: "stretch",
    marginBottom: 10,
    borderRadius: 10,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  contactSection: {
    padding: 20,
    backgroundColor: "#2c3e50",
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 5,
  },
});

export default Service;
