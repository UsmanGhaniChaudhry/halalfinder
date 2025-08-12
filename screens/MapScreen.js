import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import BottomNavigation from '../components/BottomNavigation';
import { Colors } from '../utils/Colors';

const MapScreen = ({
  // Data
  venues,
  nearbyVenues,
  userLocation,
  selectedCity,
  
  // UI State
  loading,
  activeFilter,
  locationPermission,
  
  // Functions
  navigateToScreen,
  goBack,
  requestLocation,
  setActiveFilter,
  openReviewsModal,
  openInMaps,
}) => {
  const [loadingLocation, setLoadingLocation] = React.useState(false);

  const handleFindNearby = async () => {
    setLoadingLocation(true);
    try {
      await requestLocation();
    } finally {
      setLoadingLocation(false);
    }
  };

  const FilterTab = ({ title, value, active, onPress }) => (
    <TouchableOpacity
      style={[styles.mapTab, active && styles.mapTabActive]}
      onPress={onPress}
    >
      <Text style={[styles.mapTabText, active && styles.mapTabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const VenueMarker = ({ venue }) => (
    <TouchableOpacity
      style={styles.venueMarker}
      onPress={() => openReviewsModal(venue)}
    >
      <View style={styles.markerIcon}>
        <Text style={styles.markerEmoji}>
          {venue.type === 'mosque' ? '🕌' : '🍽️'}
        </Text>
      </View>
      <View style={styles.markerInfo}>
        <Text style={styles.markerName}>{venue.name}</Text>
        <Text style={styles.markerAddress}>
          {venue.address.length > 30 
            ? venue.address.substring(0, 30) + '...' 
            : venue.address
          }
        </Text>
        <View style={styles.markerRating}>
          <Text style={styles.markerStars}>
            {'⭐'.repeat(Math.round(venue.rating || 0))}
          </Text>
          <Text style={styles.markerRatingText}>
            {(venue.rating || 0).toFixed(1)}
          </Text>
          {venue.distance_km && (
            <Text style={styles.markerDistance}>
              • {venue.distance_km.toFixed(1)}km
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.markerDirections}
        onPress={() => openInMaps(venue)}
      >
        <Text style={styles.markerDirectionsText}>🧭</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const NoVenuesMessage = () => (
    <View style={styles.noVenuesContainer}>
      <Text style={styles.noVenuesIcon}>🔍</Text>
      <Text style={styles.noVenuesTitle}>No Venues Found</Text>
      <Text style={styles.noVenuesText}>
        {userLocation 
          ? 'No venues found near your location. Try expanding your search radius.'
          : 'Tap "Find Nearby" to discover venues around you, or browse by city.'
        }
      </Text>
      {!userLocation && (
        <TouchableOpacity 
          style={styles.findNearbyButton}
          onPress={handleFindNearby}
          disabled={loadingLocation}
        >
          <Text style={styles.findNearbyButtonText}>
            📍 Find Venues Near Me
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Get venues to display (nearby or city venues)
  const displayVenues = nearbyVenues.length > 0 ? nearbyVenues : venues;
  const filteredVenues = displayVenues.filter(venue => 
    activeFilter === 'all' || venue.type === activeFilter
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔧 FIXED: Header with proper back navigation */}
      <Header
        title="Map View"
        subtitle="Mosques & Halal Restaurants"
        showBack={true}
        onBackPress={() => {
          console.log('🔙 Map back button pressed');
          goBack();
        }}
      />

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={[styles.mapControlButton, styles.primaryMapControl]}
          onPress={handleFindNearby}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <ActivityIndicator size="small" color={Colors.surface} />
          ) : (
            <>
              <Text style={styles.mapControlIcon}>📍</Text>
              <Text style={styles.mapControlText}>Find Nearby</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.mapFilterTabs}>
          <FilterTab
            title="All"
            value="all"
            active={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterTab
            title="🕌"
            value="mosque"
            active={activeFilter === 'mosque'}
            onPress={() => setActiveFilter('mosque')}
          />
          <FilterTab
            title="🍽️"
            value="restaurant"
            active={activeFilter === 'restaurant'}
            onPress={() => setActiveFilter('restaurant')}
          />
        </View>
      </View>

      {/* Location Info */}
      {userLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationInfoText}>
            📍 Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderTitle}>🗺️ Interactive Map</Text>
          <Text style={styles.mapPlaceholderSubtitle}>
            {nearbyVenues.length > 0 
              ? `Showing ${filteredVenues.length} nearby venues`
              : selectedCity 
                ? `Showing venues in ${selectedCity.name}`
                : 'Select a city or find nearby venues'
            }
          </Text>
          
          {/* Venue Markers Display */}
          <ScrollView style={styles.venueMarkers} showsVerticalScrollIndicator={false}>
            {filteredVenues.length === 0 ? (
              <NoVenuesMessage />
            ) : (
              filteredVenues.map((venue) => (
                <VenueMarker key={venue.id} venue={venue} />
              ))
            )}
          </ScrollView>
        </View>
      </View>

      {/* 🔧 FIXED: Added Bottom Navigation */}
      <BottomNavigation
        activeScreen="map"
        onNavigate={(screen) => {
          console.log('🧭 Map navigation to:', screen);
          if (screen === 'venues') {
            navigateToScreen('venues');
          } else if (screen === 'favorites') {
            navigateToScreen('favorites');
          }
        }}
        venueCount={filteredVenues.length}
        favoriteCount={0} // We don't have favorites count in map screen props
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  mapControls: {
    padding: 15,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapControlButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryMapControl: {
    backgroundColor: Colors.primary,
  },
  mapControlIcon: {
    fontSize: 16,
  },
  mapControlText: {
    color: Colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  mapFilterTabs: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  mapTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  mapTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  mapTabTextActive: {
    color: Colors.surface,
  },
  locationInfo: {
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: 10,
  },
  locationInfoText: {
    fontSize: 14,
    color: Colors.text,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  mapPlaceholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  mapPlaceholderSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  venueMarkers: {
    flex: 1,
    width: '100%',
  },
  venueMarker: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  markerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  markerEmoji: {
    fontSize: 24,
  },
  markerInfo: {
    flex: 1,
  },
  markerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  markerAddress: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  markerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markerStars: {
    fontSize: 12,
    marginRight: 5,
  },
  markerRatingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  markerDistance: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  markerDirections: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  markerDirectionsText: {
    fontSize: 20,
  },
  noVenuesContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noVenuesIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  noVenuesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  noVenuesText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  findNearbyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  findNearbyButtonText: {
    color: Colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MapScreen;