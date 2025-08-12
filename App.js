import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Linking } from 'react-native';

// Import Screen Components
import CountryScreen from './screens/CountryScreen';
import CityScreen from './screens/CityScreen';
import VenuesScreen from './screens/VenuesScreen';
import MapScreen from './screens/MapScreen';
import FavoritesScreen from './screens/FavoritesScreen';

// Import Services
import DatabaseService from './services/DatabaseService';
import LocationService from './services/LocationService';

// Import Utilities
import { Colors } from './utils/Colors';

// Import Modal Components
import ReviewsModal from './utils/ReviewsModal';
import ReviewFormModal from './utils/ReviewFormModal';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('country');
  
  // Data State
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [venues, setVenues] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // Selection State
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  
  // Map State
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyVenues, setNearbyVenues] = useState([]);
  const [locationPermission, setLocationPermission] = useState(null);
  
  // Modal State
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [reviewFormModalVisible, setReviewFormModalVisible] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Load initial data
  useEffect(() => {
    loadCountries();
  }, []);

  // Data Loading Functions
  const loadCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await DatabaseService.getCountries();
      if (result.error) {
        setError('Failed to load countries: ' + result.error);
      } else {
        setCountries(result.data || []);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async (countryId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await DatabaseService.getCitiesByCountry(countryId);
      if (result.error) {
        setError('Failed to load cities: ' + result.error);
      } else {
        setCities(result.data || []);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 FIXED: loadVenues function with proper filtering logic (INSIDE the component)
  const loadVenues = useCallback(async (cityId, search = '', filter = 'all') => {
    console.log('🎯 App.loadVenues called with:', { cityId, search, filter });
    
    setLoading(true);
    setError(null);
    
    try {
      // 🎯 KEY FIX: Convert filter value correctly
      let venueType = null;
      
      if (filter === 'mosque') {
        venueType = 'mosque';
      } else if (filter === 'restaurant') {
        venueType = 'restaurant';
      } else {
        venueType = null; // 'all' means no filter
      }
      
      console.log('🔄 Converted filter:', { original: filter, converted: venueType });
      
      const result = await DatabaseService.getVenuesByCity(cityId, search, venueType);
      
      if (result.error) {
        setError('Failed to load venues: ' + result.error);
        console.error('❌ Load venues error:', result.error);
      } else {
        console.log('✅ Venues loaded successfully:', {
          count: result.data?.length || 0,
          filter: filter,
          venueType: venueType
        });
        
        setVenues(result.data || []);
        
        // 🎯 DEBUGGING: Log what we're setting
        if (result.data) {
          const mosqueCount = result.data.filter(v => v.type === 'mosque').length;
          const restaurantCount = result.data.filter(v => v.type === 'restaurant').length;
          
          console.log('📊 Setting venues state:', {
            total: result.data.length,
            mosques: mosqueCount,
            restaurants: restaurantCount,
            activeFilter: filter
          });
        }
      }
    } catch (err) {
      const errorMsg = 'Network error: ' + err.message;
      setError(errorMsg);
      console.error('❌ Network error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Navigation Functions
  const navigateToScreen = async (screen, data = null) => {
    setCurrentScreen(screen);
    
    if (screen === 'city' && data) {
      setSelectedCountry(data);
      await loadCities(data.id);
    }
    
    if (screen === 'venues' && data) {
      setSelectedCity(data);
      await loadVenues(data.id, searchText, activeFilter);
    }
  };

  const goBack = () => {
    if (currentScreen === 'venues' || currentScreen === 'map') {
      setCurrentScreen('city');
    } else if (currentScreen === 'city') {
      setCurrentScreen('country');
    }
  };

  // Location Functions
  const requestLocation = async () => {
    try {
      const result = await LocationService.getCurrentLocation();
      if (result.success) {
        setUserLocation(result.location);
        setLocationPermission('granted');
        await findNearbyVenues(result.location.latitude, result.location.longitude);
      } else {
        setLocationPermission('denied');
        Alert.alert('Location Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location: ' + error.message);
    }
  };

  const findNearbyVenues = async (latitude, longitude, radiusKm = 10) => {
    try {
      const result = await DatabaseService.getNearbyVenues(
        latitude, 
        longitude, 
        radiusKm, 
        activeFilter === 'all' ? null : activeFilter
      );

      if (result.error) {
        throw new Error(result.error);
      }

      setNearbyVenues(result.data || []);
      
      if (result.data && result.data.length > 0) {
        Alert.alert(
          'Nearby Venues Found!',
          `Found ${result.data.length} venue(s) within ${radiusKm}km of your location.`,
          [{ text: 'View on Map', onPress: () => setCurrentScreen('map') }]
        );
      } else {
        Alert.alert(
          'No Nearby Venues',
          `No venues found within ${radiusKm}km. Try expanding your search or browse by city.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to find nearby venues: ' + error.message);
    }
  };

  // Utility Functions
  const toggleFavorite = (venueId) => {
    setFavorites(prev => 
      prev.includes(venueId) 
        ? prev.filter(id => id !== venueId)
        : [...prev, venueId]
    );
  };

  const openReviewsModal = (venue) => {
    setSelectedVenue(venue);
    setReviewsModalVisible(true);
  };

  const openReviewFormModal = (venue) => {
    setSelectedVenue(venue);
    setReviewFormModalVisible(true);
  };

  const openInMaps = (venue) => {
    const query = encodeURIComponent(`${venue.name}, ${venue.address}`);
    const url = `https://www.google.com/maps/search/${query}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps');
    });
  };

  // Screen Props
  const screenProps = {
    countries,
    cities,
    venues,
    favorites,
    nearbyVenues,
    userLocation,
    selectedCountry,
    selectedCity,
    loading,
    error,
    searchText,
    activeFilter,
    locationPermission,
    navigateToScreen,
    goBack,
    toggleFavorite,
    openReviewsModal,
    openReviewFormModal,
    openInMaps,
    requestLocation,
    setSearchText,
    setActiveFilter,
    loadVenues,
  };

  return (
    <View style={styles.app}>
      {/* Screen Rendering */}
      {currentScreen === 'country' && (
        <CountryScreen {...screenProps} />
      )}
      
      {currentScreen === 'city' && (
        <CityScreen {...screenProps} />
      )}
      
      {currentScreen === 'venues' && (
        <VenuesScreen {...screenProps} />
      )}
      
      {currentScreen === 'map' && (
        <MapScreen {...screenProps} />
      )}
      
      {currentScreen === 'favorites' && (
        <FavoritesScreen {...screenProps} />
      )}

      {/* Modal Components */}
      <ReviewsModal
        visible={reviewsModalVisible}
        venue={selectedVenue}
        onClose={() => setReviewsModalVisible(false)}
        onOpenReviewForm={() => {
          setReviewsModalVisible(false);
          setReviewFormModalVisible(true);
        }}
      />

      <ReviewFormModal
        visible={reviewFormModalVisible}
        venue={selectedVenue}
        onClose={() => setReviewFormModalVisible(false)}
        onSubmitSuccess={() => {
          setReviewFormModalVisible(false);
          if (selectedCity) {
            loadVenues(selectedCity.id, searchText, activeFilter);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});