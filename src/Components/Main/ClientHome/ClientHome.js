import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";

const CompanyHome = () => {
  const banners = [
    { id: '1', image: require('../../../Assets/banner1.png') },
    { id: '2', image: require('../../../Assets/banner2.png') },
    { id: '3', image: require('../../../Assets/banner3.png') },
    { id: '4', image: require('../../../Assets/banner4.png') },
  ];

  const [activeSlide, setActiveSlide] = useState(0); // Track the active slide
  const scrollViewRef = useRef(null); // Reference to ScrollView

  const { width } = Dimensions.get('window'); // Get screen width for responsiveness

  // Autoplay effect for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prevSlide => {
        const nextSlide = (prevSlide + 1) % banners.length;
        scrollViewRef.current.scrollTo({ x: nextSlide * width, animated: true });
        return nextSlide;
      });
    }, 3000); // 3 seconds interval

    return () => clearInterval(interval); // Clear interval on unmount
  }, [banners.length, width]);

  // Update active slide when ScrollView is manually scrolled
  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setActiveSlide(index);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.carouselItem}>
        <Image source={item.image} style={styles.carouselImage} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16} // Controls how often the scroll event fires
        >
          {banners.map((item) => renderItem(item))}
        </ScrollView>
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                activeSlide === index ? styles.paginationActiveDot : {},
              ]}
              onPress={() => {
                setActiveSlide(index);
                scrollViewRef.current.scrollTo({ x: index * width, animated: true });
              }}
            />
          ))}
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Innovate, Design, Develop</Text>
        <Text style={styles.subtitle}>Building Next-Gen Websites & Mobile Apps for Businesses Worldwide</Text>
      </View>

      {/* Other sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Who We Are</Text>
        <Text style={styles.sectionText}>
          At [YourCompany], we specialize in creating innovative and high-quality digital solutions for businesses of all sizes. Our team of skilled developers, designers, and consultants work tirelessly to build secure, scalable, and user-friendly websites and mobile apps. We are committed to bringing your vision to life by integrating the latest technologies with a customer-first approach.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 [YourCompany]. All Rights Reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  carouselImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#95a5a6",
    margin: 5,
  },
  paginationActiveDot: {
    backgroundColor: "#3498db",
  },
  header: {
    padding: 30,
    backgroundColor: "#3498db",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ecf0f1",
    marginTop: 5,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: "#7f8c8d",
    lineHeight: 24,
    marginBottom: 8,
  },
  footer: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "#2c3e50",
    borderRadius: 10,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#ecf0f1",
  },
});

export default CompanyHome;
