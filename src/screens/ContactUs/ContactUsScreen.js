import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { WebView } from "react-native-webview";

const ContactUsScreen = ({ navigation }) => {
  const webViewRef = useRef(null);
  const initialURL = "https://www.google.com/maps/place/Code+Diffusion+-+Mobile+Application+Development+Company+in+Delhi/@28.6290378,77.0703847,2542m/data=!3m3!1e3!4b1!5s0x396421a66a15b5f7:0x171170d419f52b5f!4m6!3m5!1s0x390d053a2359d897:0x7ade773a38d4c83d!8m2!3d28.6290194!4d77.0806845!16s%2Fg%2F11c2p478_s?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D";

  const handleContactPress = (url) => {
    Linking.openURL(url);
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
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.description}>
          Have questions or want to start a project? We're here to help!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter Message"
          placeholderTextColor="#aaa"
          multiline
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Get in Touch</Text>
          <TouchableOpacity>
            <Text style={styles.contactText}>📍 Plot no 24, 2nd floor Sewak park Dwarka more New delhi - 110059</Text>
          </TouchableOpacity>

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

        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: initialURL }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowUniversalAccessFromFileURLs={true}
            onShouldStartLoadWithRequest={(event) => {
              if (event.url.startsWith("tel:")) {
                handleContactPress(event.url);
                return false;
              };
              if (!event.url.includes(initialURL)) {
                handleContactPress(event.url);
                return false;
              };
              return true;
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
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
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    color: "#777",
    padding: 8,
    paddingLeft: 16,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
    paddingLeft: 16,
    paddingTop: 10,
  },
  button: {
    backgroundColor: "#ffb300",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  contactSection: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    marginTop: 50,
    borderRadius: 10
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  mapContainer: {
    width: "100%",
    height: 500,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 50,
  },
  map: {
    flex: 1,
  },
});

export default ContactUsScreen;
