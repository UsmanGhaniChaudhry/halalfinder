import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../utils/Colors';

const BottomNavigation = ({
  activeScreen,
  onNavigate,
  venueCount = 0,
  favoriteCount = 0,
}) => {

  const NavItem = ({ 
    screen, 
    icon, 
    label, 
    count, 
    isActive, 
    onPress 
  }) => (
    <TouchableOpacity 
      style={styles.navItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.navIconContainer}>
        <Text style={[
          styles.navIcon, 
          isActive && styles.navIconActive
        ]}>
          {icon}
        </Text>
        {count !== undefined && count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {count > 99 ? '99+' : count}
            </Text>
          </View>
        )}
      </View>
      <Text style={[
        styles.navText, 
        isActive && styles.navTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleNavigation = (screen) => {
    if (screen === activeScreen) return; // Don't navigate to same screen
    
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  const showComingSoon = (feature) => {
    Alert.alert(
      'Coming Soon', 
      `${feature} features will be available soon!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.bottomNav}>
      <NavItem
        screen="venues"
        icon="🏠"
        label="Home"
        isActive={activeScreen === 'venues'}
        onPress={() => handleNavigation('venues')}
      />
      
      <NavItem
        screen="map"
        icon="🗺️"
        label="Map"
        count={venueCount}
        isActive={activeScreen === 'map'}
        onPress={() => handleNavigation('map')}
      />
      
      <NavItem
        screen="favorites"
        icon="⭐"
        label="Favorites"
        count={favoriteCount}
        isActive={activeScreen === 'favorites'}
        onPress={() => handleNavigation('favorites')}
      />
      
      <NavItem
        screen="profile"
        icon="👤"
        label="Profile"
        isActive={activeScreen === 'profile'}
        onPress={() => showComingSoon('Profile')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingBottom: 25, // Extra padding for devices with home indicator
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  navIconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  navIcon: {
    fontSize: 22,
    color: Colors.textSecondary,
  },
  navIconActive: {
    color: Colors.primary,
  },
  navText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  navTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  badgeText: {
    color: Colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default BottomNavigation;