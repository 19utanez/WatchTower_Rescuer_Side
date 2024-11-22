import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, Image, StyleSheet, TouchableOpacity, Text, Button, ActivityIndicator } from 'react-native';
import ReportCard from '../components/ReportCard';

const ReportScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New state for the refresh button
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchReports = async () => {
    try {
      setLoading(true); // Show loading while fetching
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

  // UseEffect to fetch reports on initial render
  useEffect(() => {
    fetchReports();
  }, []);

  // Refresh button handler
  const handleRefresh = async () => {
    try {
      setRefreshing(true); // Show refreshing indicator
      await fetchReports(); // Re-fetch reports
    } finally {
      setRefreshing(false); // Stop refreshing indicator
    }
  };

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
    return <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />;
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

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshText}>{refreshing ? 'Refreshing...' : 'Refresh'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  reportCard: {
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#008CBA',
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  refreshText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ReportScreen;
