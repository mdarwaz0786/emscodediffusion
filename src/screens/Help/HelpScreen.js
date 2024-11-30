import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const HelpScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subHeader}>FAQs</Text>
        <View style={styles.faqContainer}>
          <Text style={styles.faqQuestion}>Q1: How do I get started with your services?</Text>
          <Text style={styles.faqAnswer}>
            A1: Simply contact us via our website or email, and we’ll schedule a consultation to understand your requirements.
          </Text>

          <Text style={styles.faqQuestion}>Q2: What types of web development services do you offer?</Text>
          <Text style={styles.faqAnswer}>
            A2: We specialize in custom web development, mobile-friendly design, e-commerce solutions, and SEO optimization.
          </Text>

          <Text style={styles.faqQuestion}>Q3: How can I contact customer support?</Text>
          <Text style={styles.faqAnswer}>
            A3: You can reach out to our support team via email at info@codediffusion.in or call us at +91-7827114607.
          </Text>
        </View>

        <Text style={styles.subHeader}>Contact Support</Text>
        <Text style={styles.text}>
          For any inquiries or technical issues, please don't hesitate to get in touch with our support team. We're here to help!
        </Text>
        <Text style={styles.supportDetails}>
          Email: info@codediffusion.in
        </Text>
        <Text style={styles.supportDetails}>
          Phone: +91-7827114607
        </Text>

        <View style={styles.linkContainer}>
          <Text style={styles.subHeader}>Useful Links</Text>
          <Text style={styles.link}>
            👉 Visit our [Website] (https://www.codediffusion.in) for more information.
          </Text>
        </View>

        <Text style={styles.footer}>
          We're committed to providing top-notch support. Thank you for choosing us!
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 100,
    padding: 12,
    backgroundColor: "#fff",
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  faqContainer: {
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "400",
    color: "#444",
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#ddd",
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  supportDetails: {
    fontSize: 14,
    color: "#333",
  },
  linkContainer: {
    marginTop: 30,
  },
  link: {
    fontSize: 14,
    color: "#0066cc",
    textDecorationLine: "underline",
  },
  footer: {
    fontSize: 15,
    color: "#333",
    fontWeight: "400",
    marginTop: 30,
    textAlign: "center",
  },
});

export default HelpScreen;
