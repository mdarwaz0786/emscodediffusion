import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const HelpScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Help & Support</Text>

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
          A3: You can reach out to our support team via email at support@webdevcompany.com or call us at (123) 456-7890.
        </Text>
      </View>

      <Text style={styles.subHeader}>Contact Support</Text>
      <Text style={styles.text}>
        For any inquiries or technical issues, please don't hesitate to get in touch with our support team. We're here to help!
      </Text>
      <Text style={styles.supportDetails}>
        Email: support@webdevcompany.com
      </Text>
      <Text style={styles.supportDetails}>
        Phone: (123) 456-7890
      </Text>

      <Text style={styles.subHeader}>Useful Links</Text>
      <Text style={styles.link}>
        👉 Visit our [Website](https://www.webdevcompany.com) for more information.
      </Text>
      <Text style={styles.link}>
        👉 Check out our [Blog](https://www.webdevcompany.com/blog) for the latest updates and tips.
      </Text>
      <Text style={styles.link}>
        👉 Explore our [Portfolio](https://www.webdevcompany.com/portfolio) to see our previous projects.
      </Text>

      <Text style={styles.footer}>
        We're committed to providing top-notch support. Thank you for choosing us!
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginTop: 20,
    marginBottom: 10,
  },
  faqContainer: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
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
    marginBottom: 5,
  },
  link: {
    fontSize: 14,
    color: "#0066cc",
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  footer: {
    fontSize: 16,
    color: "#333",
    fontWeight: "700",
    marginTop: 30,
    textAlign: "center",
  },
});

export default HelpScreen;
