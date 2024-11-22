import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { getImageUrlById } from '../utils/ImageUtils';

const ReportCard = ({ reportedBy, location, images = [], description }) => {
  // State for managing the image preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Generate URLs using the utility function
  const imageUrls = images.map((id) => getImageUrlById(id));

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsPreviewOpen(true);
  };

  const handleNextImage = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>
        {reportedBy} - {location}
      </Text>
      <Text style={styles.reportDescription}>{description}</Text>

      <View style={styles.imagesContainer}>
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <TouchableOpacity key={index} onPress={() => handleImageClick(index)}>
              <Image source={{ uri: url }} style={styles.image} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noImageText}>No images available</Text>
        )}
      </View>

      {/* Image preview modal */}
      {isPreviewOpen && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isPreviewOpen}
          onRequestClose={closePreview}
        >
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: imageUrls[currentImageIndex] }}
              style={styles.previewImage}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Previous"
                onPress={handlePrevImage}
                disabled={currentImageIndex === 0}
              />
              <Button title="Close" onPress={closePreview} />
              <Button
                title="Next"
                onPress={handleNextImage}
                disabled={currentImageIndex === imageUrls.length - 1}
              />
            </View>
          </View>
        </Modal>
      )}
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 16,
  },
});

export default ReportCard;
