// components/ReportCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ReportCard = ({ reportedBy, location, images, description }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Reported By: {reportedBy}</Text>
      <Text style={styles.subtitle}>Location: {location}</Text>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2A3A',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#D9D9D9',
    marginVertical: 4,
  },
  imageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 8,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: '#fff',
  },
});

export default ReportCard;
