import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
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
          <Text style={styles.faqQuestion}>
            Q1: How do I get started with your services?
          </Text>
          <Text style={styles.faqAnswer}>
            A1: Simply contact us via our website or email, and we’ll schedule a consultation to understand your requirements.
          </Text>

          <Text style={styles.faqQuestion}>
            Q2: What types of web development services do you offer?
          </Text>
          <Text style={styles.faqAnswer}>
            A2: We specialize in custom web development, mobile-friendly design, e-commerce solutions, and SEO optimization.
          </Text>

          <Text style={styles.faqQuestion}>
            Q3: How can I contact customer support?
          </Text>
          <Text style={styles.faqAnswer}>
            A3: You can reach out to our support team via email at info@codediffusion.in or call us at +91-7827114607.
          </Text>

          {/* New FAQs */}
          <Text style={styles.faqQuestion}>
            Q4: How long does it take to complete a project?
          </Text>
          <Text style={styles.faqAnswer}>
            A4: The duration depends on the project’s complexity and scope. Generally, it ranges from a few weeks to several months.
          </Text>

          <Text style={styles.faqQuestion}>
            Q5: Do you provide post-launch support and maintenance?
          </Text>
          <Text style={styles.faqAnswer}>
            A5: Yes, we offer post-launch support and maintenance services to ensure your application runs smoothly.
          </Text>

          <Text style={styles.faqQuestion}>
            Q6: Can I request custom features for my project?
          </Text>
          <Text style={styles.faqAnswer}>
            A6: Absolutely! We specialize in custom development to meet your unique requirements.
          </Text>

          <Text style={styles.faqQuestion}>
            Q7: Do you handle hosting and domain setup?
          </Text>
          <Text style={styles.faqAnswer}>
            A7: Yes, we can assist with hosting, domain setup, and configuration to ensure a seamless deployment process.
          </Text>

          <Text style={styles.faqQuestion}>
            Q8: What payment methods do you accept?
          </Text>
          <Text style={styles.faqAnswer}>
            A8: We accept various payment methods including bank transfers, credit cards, and digital wallets.
          </Text>
        </View>

        <Text style={styles.subHeader}>Contact Support</Text>
        <Text style={styles.text}>
          For any inquiries or technical issues, please don't hesitate to get in
          touch with our support team. We're here to help!
        </Text>
        <Text style={styles.supportDetails}>Email: info@codediffusion.in</Text>
        <Text style={styles.supportDetails}>Phone: +91-7827114607</Text>

        <View style={styles.linkContainer}>
          <Text style={styles.subHeader}>Useful Links</Text>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.codediffusion.in")}>
            <Text style={styles.link}>
              👉 Visit our [Website] (https://www.codediffusion.in) for more information.
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          We're committed to providing top-notch support. Thank you for choosing
          us!
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
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 1000,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    marginBottom: 5,
    textAlign: "center",
  },
  faqContainer: {
    marginBottom: 5,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  supportDetails: {
    fontSize: 14,
    color: "#555",
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    fontSize: 14,
    color: "#0066cc",
  },
  footer: {
    fontSize: 14,
    color: "#555",
    fontWeight: "400",
    marginTop: 20,
  },
});

export default HelpScreen;
