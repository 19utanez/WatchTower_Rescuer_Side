import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import ReportCard from '../components/ReportCard';

const reportsData = [
  {
    id: '1',
    reportedBy: 'John Doe',
    location: 'Downtown Park',
    images: ['https://via.placeholder.com/80', 'https://via.placeholder.com/80'],
    description: 'A tree fell across the main walking path.',
  },
  {
    id: '2',
    reportedBy: 'Jane Smith',
    location: 'City Library',
    images: ['https://via.placeholder.com/80'],
    description: 'The water fountain is not working.',
  },
  {
    id: '3',
    reportedBy: 'Bob Johnson',
    location: 'Community Hall',
    images: [],
    description: 'A pipe burst in the main hall.',
  },
];

export default function ReportScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Reports</Text>
      </View>

      {/* Report List */}
      <FlatList
        data={reportsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard
            reportedBy={item.reportedBy}
            location={item.location}
            images={item.images}
            description={item.description}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071025' },
  navbar: {
    height: 60,
    backgroundColor: '#1E2A3A',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  navbarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
});
