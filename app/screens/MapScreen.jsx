import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import polyline from 'polyline'; // For decoding Google Maps polyline
import { GOOGLE_MAPS_API_KEY } from '@env'; // Ensure .env file has your API key

export default function MapScreen({ route, navigation }) {
  const { location } = route.params; // Get the destination location from navigation params

  const initialCenter = {
    latitude: 14.5995, // Static origin marker
    longitude: 121.0338, // Static origin marker
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState(initialCenter);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]); // For the polyline

  // Geocode address to get latitude and longitude
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log('Geocoded location:', { lat, lng });
        return { latitude: lat, longitude: lng };
      } else {
        console.error('Geocoding failed:', data);
        Alert.alert('Error', 'Unable to geocode the provided address.');
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      Alert.alert('Error', 'Unable to geocode the provided address.');
      return null;
    }
  };

  // Parse and validate the location passed from ReportScreen
  useEffect(() => {
    const processLocation = async () => {
      if (location) {
        console.log('Received location from ReportScreen:', location);

        // Try parsing it as latitude,longitude format
        if (location.includes(',')) {
          const [lat, lng] = location.split(',').map(part => part.trim()); // Trim extra spaces

          console.log('Parsed latitude:', lat, 'Parsed longitude:', lng);

          const parsedLat = parseFloat(lat);
          const parsedLng = parseFloat(lng);

          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            setDestination({ latitude: parsedLat, longitude: parsedLng });
            console.log('Destination set:', { latitude: parsedLat, longitude: parsedLng });
          } else {
            // If parsing failed, treat it as an address
            const geocodedLocation = await geocodeAddress(location);
            if (geocodedLocation) {
              setDestination(geocodedLocation);
            }
          }
        }
      }
    };

    processLocation();
  }, [location]);

  // Fetch route from Google Maps Directions API
  useEffect(() => {
    const fetchRoute = async () => {
      if (destination) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${initialCenter.latitude},${initialCenter.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.status === 'OK') {
            const points = polyline.decode(data.routes[0].overview_polyline.points);
            const routeCoords = points.map((point) => ({
              latitude: point[0],
              longitude: point[1],
            }));
            setRouteCoordinates(routeCoords);
          } else {
            console.error('Directions API error:', data);
            Alert.alert('Error', 'Unable to fetch route data.');
          }
        } catch (error) {
          console.error('Route fetching error:', error);
          Alert.alert('Error', 'Unable to fetch route data.');
        }
      }
    };

    fetchRoute();
  }, [destination]);

  const handleStatusUpdate = async (newStatus) => {
    // Update status logic for the report (same as before)
    console.log('Report status updated:', newStatus);
    Alert.alert('Status Update', `Report marked as ${newStatus}`);
    navigation.goBack(); // Navigate back to the ReportScreen after status update
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={region} title="Origin" description="SAN JUAN NDRRMO HQ" />
        {destination && <Marker coordinate={destination} title="Destination" description="Report Location" />}
        {routeCoordinates.length > 0 && <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="#0000FF" />}
      </MapView>
      <View style={styles.controls}>
        <Button title="Success" onPress={() => handleStatusUpdate('Completed')} />
        <Button title="Failed" onPress={() => handleStatusUpdate('Failed')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});

export default MapScreen;
