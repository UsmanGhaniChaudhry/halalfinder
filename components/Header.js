import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../utils/Colors';

const Header = ({ 
  title, 
  subtitle, 
  showBack = false, 
  onBackPress,
  rightElement,
  backgroundColor = Colors.primary
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      
      {rightElement ? (
        <View style={styles.rightElement}>
          {rightElement}
        </View>
      ) : !showBack ? (
        <Text style={styles.headerIcon}>☪️</Text>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.surface,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 5,
    textAlign: 'center',
  },
  headerIcon: {
    fontSize: 24,
    position: 'absolute',
    right: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: '50%',
    marginTop: -12,
    padding: 5,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  rightElement: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -12,
  },
  spacer: {
    width: 40,
  },
});

export default Header;