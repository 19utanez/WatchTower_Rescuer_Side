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
              console.log('Destination set after geocoding:', geocodedLocation);
            }
          }
        } else {
          // Handle address format (requires geocoding)
          const geocodedLocation = await geocodeAddress(location);
          if (geocodedLocation) {
            setDestination(geocodedLocation);
            console.log('Destination set after geocoding:', geocodedLocation);
          }
        }
      } else {
        console.log('No location passed.');
      }
    };

    processLocation();
  }, [location]);

  // Fetch route from Google Maps Directions API
  useEffect(() => {
    const fetchRoute = async () => {
      if (!destination) return;

      const origin = `${initialCenter.latitude},${initialCenter.longitude}`;
      const dest = `${destination.latitude},${destination.longitude}`;

      console.log('Fetching route from', origin, 'to', dest);

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        // Log the full response for debugging
        console.log('Google Maps API response:', data);

        if (data.status === 'OK' && data.routes.length > 0) {
          const points = data.routes[0].overview_polyline.points;
          const decodedPoints = polyline.decode(points).map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));
          setRouteCoordinates(decodedPoints);
        } else {
          Alert.alert('No route found', 'Unable to fetch route from Google Maps.');
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        Alert.alert('Error', 'Unable to fetch route. Please try again.');
      }
    };

    fetchRoute();
  }, [destination]);

  // Zoom in functionality
  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  // Zoom out functionality
  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => navigation.navigate('Profile')} // Navigate to ProfileScreen
      >
        <MaterialCommunityIcons name="account-circle" size={60} color="#D9D9D9" />
      </TouchableOpacity>

      <MapView style={styles.map} region={region}>
        {/* Origin Marker */}
        <Marker coordinate={region} title="Origin" description="SAN JUAN NDRRMO HEAD QUARTERS" />

        {/* Destination Marker */}
        {destination && (
          <Marker coordinate={destination} title="Destination" description="" />
        )}

        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeColor="blue" strokeWidth={4} />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Zoom Out" onPress={zoomOut} />
        <Button title="Zoom In" onPress={zoomIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071025',
  },
  map: {
    flex: 1,
  },
  profileIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1, // Ensure the icon is above other elements
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});
