// app/screens/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import logo from '../../assets/logo.png';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} >WELCOME TO</Text>
      <Text style={styles.title} > WATCH TOWER</Text>

      <Image source={logo} style={styles.logo} />
      {/* Profile Icon */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#071025',
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 70,
  },

  profileIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1, // Ensure the icon is above other elements
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#fff'
  },
});
