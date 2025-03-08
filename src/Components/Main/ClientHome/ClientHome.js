import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, Text, StyleSheet, Image, Dimensions, Linking, TouchableOpacity } from "react-native";
const { width } = Dimensions.get("window");

const CompanyHome = () => {
  const banners = [
    { id: "1", image: require("../../../Assets/banner1.png") },
    { id: "2", image: require("../../../Assets/banner2.png") },
    { id: "3", image: require("../../../Assets/banner3.png") },
    { id: "4", image: require("../../../Assets/banner4.png") },
  ];

  const extendedBanners = [...banners, banners[0]];
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        let nextSlide = prev + 1;
        if (nextSlide === extendedBanners.length) {
          scrollRef.current?.scrollTo({ x: 0, animated: false });
          return 0;
        } else {
          scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
          return nextSlide;
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex === extendedBanners.length - 1) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      }, 300);
      setActiveSlide(0);
    } else {
      setActiveSlide(slideIndex);
    };
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@codediffusion.in');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+91-7827114607');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.codediffusion.in');
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={styles.carouselContainer}
        >
          {extendedBanners.map((item, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image source={item.image} style={styles.carouselImage} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.mainSection}>
          {/* About Us */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who We Are</Text>
            <Text style={styles.sectionText}>
              At Code Diffusion Technologies we specialize in creating innovative and high-quality digital solutions for businesses of all sizes. Our team of skilled developers, designers, and consultants work tirelessly to build secure, scalable, and user-friendly websites and mobile apps. We are committed to bringing your vision to life by integrating the latest technologies with a customer-first approach.
            </Text>
          </View>

          {/* Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <Text style={styles.sectionText}>
              We offer a wide range of IT services that cater to various business needs:
            </Text>
            <Text style={styles.sectionText}>✔ Custom Website Development: Tailored solutions that align with your business goals and user needs.</Text>
            <Text style={styles.sectionText}>✔ Mobile App Development (iOS & Android): Cutting-edge apps that provide exceptional user experiences.</Text>
            <Text style={styles.sectionText}>✔ UI/UX Design & Branding: Stunning designs that elevate your brand’s presence and user engagement.</Text>
            <Text style={styles.sectionText}>✔ Cloud & Backend Solutions: Reliable, scalable cloud services and secure backend infrastructure for your applications.</Text>
            <Text style={styles.sectionText}>✔ Digital Marketing & SEO: Helping businesses increase their online visibility and attract more customers.</Text>
          </View>

          {/* Why Choose Us */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose Us?</Text>
            <Text style={styles.sectionText}>🚀 Expertise in the latest technologies such as React, Node.js, and Cloud Services.</Text>
            <Text style={styles.sectionText}>🔒 We ensure the highest level of security, scalability, and performance for all our solutions.</Text>
            <Text style={styles.sectionText}>💡 A customer-centric approach that helps deliver tailored solutions to meet specific business objectives.</Text>
            <Text style={styles.sectionText}>🕒 24/7 Support & Maintenance: We offer continuous support to ensure your applications run smoothly.</Text>
            <Text style={styles.sectionText}>💼 Proven track record of delivering successful projects for various industries, including eCommerce, healthcare, finance, and more.</Text>
          </View>

          {/* Portfolio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Portfolio</Text>
            <Text style={styles.sectionText}>
              Our portfolio showcases a variety of successful projects, including:
            </Text>
            <Text style={styles.sectionText}>✅ E-commerce Platforms: Custom solutions for global online stores, providing seamless shopping experiences.</Text>
            <Text style={styles.sectionText}>✅ Enterprise Management Solutions: Robust, scalable systems for managing large organizations.</Text>
            <Text style={styles.sectionText}>✅ Social Media Applications: Engaging platforms for connecting users globally.</Text>
            <Text style={styles.sectionText}>✅ Healthcare & Finance Applications: Secure and HIPAA-compliant solutions for healthcare providers and financial institutions.</Text>
          </View>

          {/* Testimonials */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What Our Clients Say</Text>

            <Text style={styles.sectionText}>
              "The team at Code Diffusion Technologies went above and beyond to deliver an outstanding product. Their dedication, attention to detail, and expertise made all the difference. Our project was a huge success, and we couldn't be more grateful for their hard work!" - Parach Desai
            </Text>

            <Text style={styles.sectionText}>
              "Working with Code Diffusion Technologies has been an absolute game-changer for our business. From concept to execution, they brought innovative ideas to life and executed them flawlessly. We look forward to more collaborations in the future!" - Ashutosh Ojha
            </Text>

            <Text style={styles.sectionText}>
              "We have partnered with many agencies in the past, but Code Diffusion Technologies stands out in terms of professionalism, creativity, and reliability. Their team delivered exceptional results on time and within budget. Highly recommended!" - Yadav Himanshu
            </Text>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>

            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={[styles.sectionText, { marginBottom: 5 }]}>📩 info@codediffusion.in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePhonePress}>
              <Text style={[styles.sectionText, { marginBottom: 5 }]}>📞 +91-7827114607</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleWebsitePress}>
              <Text style={[styles.sectionText, { marginBottom: 5 }]}>🌍 https://www.codediffusion.in</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionText]}>
              📍 Plot no 24, 2nd floor Sewak park Dwarka more New delhi - 110059
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Code Diffusion Technologies. All Rights Reserved.</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    width,
  },
  carouselItem: {
    width,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  mainSection: {
    padding: 15,
    paddingVertical: 10,
  },
  section: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 24,
    marginBottom: 10,
  },
  footer: {
    padding: 10,
    paddingHorizontal: 0,
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  footerText: {
    fontSize: 13,
    color: "#fff",
  },
});

export default CompanyHome;
