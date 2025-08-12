import { Platform, PermissionsAndroid } from 'react-native';

// Location Service - Handles all location-related functionality
class LocationService {
  
  // Request location permission
  static async requestLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Halal Finder Location Permission',
            message: 'Halal Finder needs access to your location to find nearby mosques and halal restaurants.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // For iOS and web, we'll handle permission in the geolocation call
        return true;
      }
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  }

  // Get current location
  static async getCurrentLocation() {
    try {
      // Check if permission is granted
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        return {
          success: false,
          error: 'Location permission denied. Please allow location access in your device settings.'
        };
      }

      // Get current position
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('Got user location:', latitude, longitude);
              
              resolve({
                success: true,
                location: { latitude, longitude },
                error: null
              });
            },
            (error) => {
              console.error('Location error:', error);
              let errorMessage = 'Unable to get your current location.';
              
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = 'Location access denied. Please enable location services.';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = 'Location information is unavailable.';
                  break;
                case error.TIMEOUT:
                  errorMessage = 'Location request timed out. Please try again.';
                  break;
                default:
                  errorMessage = 'An unknown error occurred while getting location.';
                  break;
              }
              
              resolve({
                success: false,
                location: null,
                error: errorMessage
              });
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
            }
          );
        } else {
          resolve({
            success: false,
            location: null,
            error: 'Geolocation is not supported by this device.'
          });
        }
      });
    } catch (error) {
      console.error('getCurrentLocation error:', error);
      return {
        success: false,
        location: null,
        error: 'Failed to get location: ' + error.message
      };
    }
  }

  // Calculate distance between two points (Haversine formula)
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  }

  // Add distance to venues array
  static addDistanceToVenues(venues, userLocation) {
    if (!userLocation || !venues) return venues;
    
    return venues.map(venue => {
      if (venue.latitude && venue.longitude) {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          venue.latitude,
          venue.longitude
        );
        return {
          ...venue,
          distance_km: parseFloat(distance.toFixed(2))
        };
      }
      return venue;
    }).sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));
  }

  // Check if location services are available
  static isLocationAvailable() {
    return !!navigator.geolocation;
  }

  // Format coordinates for display
  static formatCoordinates(latitude, longitude) {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

export default LocationService;