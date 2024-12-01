// app/screens/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import logo from '../../assets/rescue_img.png';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.gradientBackground}>
      <View style={styles.overlayContainer}>
        <Text style={styles.title}>WELCOME TO</Text>
        <Text style={styles.title}>WATCH TOWER</Text>

        <Image source={logo} style={styles.logo} />

        <Text style={styles.descriptions}>
          WatchTower is a real-time disaster management platform for San Juan CDRRMO, streamlining reports and response coordination. It integrates AI, verification, and rescue operations across three components: Web Admin, Mobile Citizen, and Mobile Rescuer. Using an AI-powered model, it prioritizes verified reports by severity, ensuring efficient resource allocation and swift action during emergencies.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#071025',
  },
  overlayContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle overlay
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 390,
    height: 350,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptions: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
