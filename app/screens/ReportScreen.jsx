import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, Image, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import ReportCard from '../components/ReportCard';

const ReportScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://192.168.1.12:5000/api/reports');
      const data = await response.json();

      const updatedReports = await Promise.all(
        data.map(async (report) => {
          const imageUrls = await Promise.all(
            report.disasterImages.map(async (id) => {
              const imageResponse = await fetch(`http://192.168.1.12:5000/api/image/${id}`);
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

  const handleImageClick = (images, index) => {
    setCurrentImages(images);
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  const closePreview = () => setPreviewVisible(false);

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

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <ReportCard
        reportedBy={item.reportedBy}
        location={item.location}
        description={item.disasterInfo}
        images={item.imageUrls}
        onImageClick={handleImageClick}
      />
      <Button
  title="Respond"
  onPress={() => {
    const location = item.location; // location is already in "latitude,longitude" format
    navigation.navigate('Map', { location });
  }}
/>

    </View>
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
  // Styles as defined previously
});

export default ReportScreen;
