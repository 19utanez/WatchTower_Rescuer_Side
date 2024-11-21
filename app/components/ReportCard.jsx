import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const ReportCard = ({ reportedBy, location, images, description }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const toggleModal = (image) => {
    setSelectedImage(image); // Set the selected image to show in the modal
    setIsModalVisible(!isModalVisible); // Toggle modal visibility
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Reported By: {reportedBy}</Text>
      <Text style={styles.subtitle}>Location: {location}</Text>
      
      {/* Display the images */}
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => toggleModal(image)}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.description}>{description}</Text>

      {/* Modal for showing the larger image */}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </View>
      </Modal>
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
  // Modal styles
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
});

export default ReportCard;
