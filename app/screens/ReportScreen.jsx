import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ReportCard from '../components/ReportCard';

const ReportScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://192.168.1.12:5000/api/reports');
      const data = await response.json();

      // Fetch image URLs for each report
      const updatedReports = await Promise.all(
        data.map(async (report) => {
          const imageUrls = await Promise.all(
            report.disasterImages.map(async (id) => {
              const imageResponse = await fetch(`http://192.168.1.12:5000/api/image/${id}`);
              return imageResponse.url; // Ensure backend returns valid URL
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

  const handleImageClick = (images, index) => {
    setCurrentImages(images);
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  const closePreview = () => setPreviewVisible(false);

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

      <Modal visible={previewVisible} transparent>
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: currentImages[currentIndex] }}
            style={styles.previewImage}
          />
          <TouchableOpacity onPress={closePreview} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
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
  closeButton: {
    marginTop: 20,
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
