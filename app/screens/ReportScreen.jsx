import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ReportCard from '../components/ReportCard';

const ReportScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetching reports and image URLs
  const fetchReports = async () => {
    try {
      const response = await fetch('http://172.20.23.3:5000/api/reports');
      const data = await response.json();

      const updatedReports = await Promise.all(
        data.map(async (report) => {
          const imageUrls = await Promise.all(
            report.disasterImages.map(async (id) => {
              const imageResponse = await fetch(`http://172.20.23.3:5000/api/image/${id}`);
              return imageResponse.url;
            })
          );
          return { ...report, imageUrls };
        })
      );

      setReports(updatedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle image click to open preview
  const handleImageClick = (images, index) => {
    setCurrentImages(images);
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  // Close preview modal
  const closePreview = () => setPreviewVisible(false);

  // Handle Next and Previous image navigation
  const handleNextImage = () => {
    if (currentIndex < currentImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Render each report card
  const renderReport = ({ item }) => (
    <ReportCard
      reportedBy={item.reportedBy}
      location={item.location}
      description={item.disasterInfo}
      images={item.imageUrls}
      onImageClick={handleImageClick}
    />
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={renderReport}
      />

      {/* Image preview modal */}
      <Modal visible={previewVisible} transparent>
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: currentImages[currentIndex] }}
            style={styles.previewImage}
          />
          <View style={styles.modalControls}>
            <TouchableOpacity
              onPress={handlePrevImage}
              style={[styles.controlButton, currentIndex === 0 && styles.disabled]}
              disabled={currentIndex === 0}
            >
              <Text style={styles.controlText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closePreview} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextImage}
              style={[styles.controlButton, currentIndex === currentImages.length - 1 && styles.disabled]}
              disabled={currentIndex === currentImages.length - 1}
            >
              <Text style={styles.controlText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  modalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 16,
  },
  controlButton: {
    padding: 10,
    backgroundColor: '#1e88e5',
    borderRadius: 5,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  controlText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReportScreen;
