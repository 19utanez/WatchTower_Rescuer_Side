import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ReportCard = ({ reportedBy, location, images = [], description, onImageClick }) => {
  return (
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>{reportedBy} - {location}</Text>
      <Text style={styles.reportDescription}>{description}</Text>

      <View style={styles.imagesContainer}>
        {images.length > 0 ? (
          images.map((url, index) => (
            <TouchableOpacity key={index} onPress={() => onImageClick(images, index)}>
              <Image source={{ uri: url }} style={styles.image} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noImageText}>No images available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: '#1E2A3A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  reportDescription: {
    marginTop: 8,
    fontSize: 16,
    color: '#ccc',
  },
  imagesContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 100,
    height: 100,
    margin: 8,
    borderRadius: 8,
  },
  noImageText: {
    color: '#aaa',
    fontStyle: 'italic',
  },
});

export default ReportCard;
