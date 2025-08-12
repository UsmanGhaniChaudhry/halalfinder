// Colors utility - Centralized color definitions
export const Colors = {
  // Primary Colors
  primary: '#4CAF50',
  primaryDark: '#2E7D32',
  primaryLight: '#81C784',
  
  // Surface Colors
  surface: '#ffffff',
  background: '#f8f9fa',
  
  // Text Colors
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  
  // Border and Divider Colors
  border: '#e0e0e0',
  divider: '#f0f0f0',
  
  // Status Colors
  error: '#e91e63',
  warning: '#ff9800',
  success: '#4caf50',
  info: '#2196f3',
  
  // Venue Type Colors
  mosque: '#1976d2',
  mosqueLight: '#e3f2fd',
  restaurant: '#f57c00',
  restaurantLight: '#fff3e0',
  
  // Rating Colors
  rating: '#ffc107',
  ratingBackground: '#fff8e1',
  
  // Map Colors
  mapBackground: '#f0f8ff',
  mapBorder: '#4CAF50',
  markerBackground: '#ffffff',
  
  // Modal Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  modalBackground: '#ffffff',
  
  // Button Colors
  buttonPrimary: '#4CAF50',
  buttonSecondary: '#f8f9fa',
  buttonText: '#ffffff',
  buttonTextSecondary: '#4CAF50',
  
  // Special Colors
  verified: '#4caf50',
  favorite: '#e91e63',
  disabled: '#cccccc',
  
  // Gradient Colors (for future use)
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',
};

// Color helper functions
export const ColorHelpers = {
  // Get venue type color
  getVenueTypeColor: (type) => {
    return type === 'mosque' ? Colors.mosque : Colors.restaurant;
  },
  
  // Get venue type background color
  getVenueTypeBackground: (type) => {
    return type === 'mosque' ? Colors.mosqueLight : Colors.restaurantLight;
  },
  
  // Add opacity to color
  addOpacity: (color, opacity) => {
    // Simple implementation for hex colors
    if (color.startsWith('#')) {
      const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return color + alpha;
    }
    return color;
  },
  
  // Get rating color based on rating value
  getRatingColor: (rating) => {
    if (rating >= 4.5) return Colors.success;
    if (rating >= 3.5) return Colors.warning;
    if (rating >= 2.5) return Colors.error;
    return Colors.textLight;
  },
};

export default Colors;