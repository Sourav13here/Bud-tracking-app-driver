import React, { useState, useRef } from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Dimensions,
    Animated,
} from 'react-native';
import { Image } from "expo-image";
import styles from './OnboardingStyles';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const scrollViewRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const onboardingData = [
        {
            id: 1,
            title: "Real-Time Bus Tracking",
            subtitle: "Know Exactly Where Your Bus Is",
            description: "Track your bus location in real-time and never miss your ride. Get accurate arrival times and live updates on your bus route.",
            image: require('../../assets/images/company_logo.jpeg'), // Add your bus tracking image
            icon: "🚌"
        },
        {
            id: 2,
            title: "Find Bus Stops Easily",
            subtitle: "Locate Nearby Bus Stops",
            description: "Discover all bus stops around you with ease. Find the nearest stops, check routes, and plan your journey effortlessly.",
            image: require('../../assets/images/bus-station.png'), // Add your bus stops image
            icon: "📍"
        },
        {
            id: 3,
            title: "Smart Notifications",
            subtitle: "Stay Updated Always",
            description: "Get instant alerts about bus arrivals, delays, and route changes. Never miss important updates about your daily commute.",
            image: require('../../assets/images/bus.png'), // Add your notifications image
            icon: "🔔"
        }
    ];

    const renderIllustration = (index) => {
        switch (index) {
            case 0:
                return (
                    <View style={styles.trackingIllustration}>
                        <View style={styles.busContainer}>
                            <View style={styles.bus}>
                                <Text style={styles.busText}>🚌</Text>
                            </View>
                            <View style={styles.trackingLine} />
                            <View style={styles.locationPin}>
                                <Text style={styles.pinText}>📍</Text>
                            </View>
                        </View>
                        <View style={styles.mapBackground}>
                            <Text style={styles.mapText}>Live Location</Text>
                        </View>
                    </View>
                );
            case 1:
                return (
                    <View style={styles.stopsIllustration}>
                        <View style={styles.stopsContainer}>
                            <View style={styles.busStop}>
                                <Text style={styles.stopText}>🚏</Text>
                            </View>
                            <View style={styles.busStop}>
                                <Text style={styles.stopText}>🚏</Text>
                            </View>
                            <View style={styles.busStop}>
                                <Text style={styles.stopText}>🚏</Text>
                            </View>
                        </View>
                        <View style={styles.searchContainer}>
                            <Text style={styles.searchText}>🔍 Find Nearby</Text>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.notificationIllustration}>
                        <View style={styles.phoneContainer}>
                            <View style={styles.phone}>
                                <View style={styles.notification}>
                                    <Text style={styles.notifText}>🔔</Text>
                                    <Text style={styles.notifMessage}>Bus arriving in 5 min</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.alertsContainer}>
                            <Text style={styles.alertsText}>Smart Alerts</Text>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    const handleNext = () => {
        if (currentPage < onboardingData.length - 1) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
        } else {
            // Navigate to login screen
            navigation.navigate('Login');
        }
    };

    const handleSkip = () => {
        navigation.navigate('Login');
    };

    const handleDotPress = (index) => {
        setCurrentPage(index);
        scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    };

    const renderOnboardingItem = ({ item, index }) => (
        <View style={styles.slideContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.iconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.illustrationContainer}>
                        {/* Replace with your actual images */}
                        <View style={styles.placeholderImage}>
                            <Text style={styles.placeholderText}>Bus Tracking Illustration</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        </View>
    )
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentPage(pageIndex);
                }}
                style={styles.scrollView}
            >
                {onboardingData.map((item, index) => (
                    <View key={item.id} style={styles.slideContainer}>
                        <View style={styles.contentContainer}>
                            <View style={styles.imageContainer}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.iconText}>{item.icon}</Text>
                                </View>
                                <View style={styles.illustrationContainer}>
                                    <View style={styles.placeholderImage}>
                                        <Text style={styles.placeholderText}>
                                            {index === 0 ? "Bus Tracking" : index === 1 ? "Bus Stops" : "Notifications"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.subtitle}>{item.subtitle}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Page Indicators */}
                <View style={styles.pagination}>
                    {onboardingData.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dot,
                                currentPage === index ? styles.activeDot : styles.inactiveDot
                            ]}
                            onPress={() => handleDotPress(index)}
                        />
                    ))}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.nextButtonText}>
                        {currentPage === onboardingData.length - 1 ? "Get Started" : "Next"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default OnboardingScreen;