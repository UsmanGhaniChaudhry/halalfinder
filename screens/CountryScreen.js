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
import { Colors } from '../utils/Colors';

const CountryScreen = ({
  // Data
  countries,
  
  // UI State
  loading,
  error,
  
  // Functions
  navigateToScreen,
}) => {

  const LoadingSpinner = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading countries...</Text>
    </View>
  );

  const ErrorMessage = ({ message, onRetry }) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const CountryCard = ({ country }) => {
    const isActive = country.status === 'active';
    
    return (
      <TouchableOpacity
        style={[
          styles.selectionCard,
          !isActive && styles.disabledCard
        ]}
        onPress={() => isActive && navigateToScreen('city', country)}
        disabled={!isActive}
        activeOpacity={isActive ? 0.7 : 1}
      >
        <Text style={styles.cardFlag}>{country.flag_emoji}</Text>
        <Text style={styles.cardTitle}>{country.name}</Text>
        <Text style={[
          styles.cardSubtitle,
          !isActive && styles.disabledText
        ]}>
          {isActive 
            ? `${country.city_count} cities • ${country.venue_count}+ places`
            : 'Coming soon'
          }
        </Text>
        {isActive && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeIndicatorText}>Available</Text>
          </View>
        )}
        {!isActive && (
          <View style={styles.comingSoonIndicator}>
            <Text style={styles.comingSoonText}>🚧 Coming Soon</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Halal Finder" 
        subtitle="Find mosques and halal restaurants worldwide" 
      />
      
      {loading && <LoadingSpinner />}
      
      {error && !loading && (
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      )}
      
      {!loading && !error && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome! 🎉</Text>
            <Text style={styles.welcomeText}>
              Select your country to find mosques and halal restaurants near you. 
              We're expanding to more countries soon!
            </Text>
            
            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {countries.reduce((sum, country) => sum + (country.venue_count || 0), 0)}+
                </Text>
                <Text style={styles.statLabel}>Total Venues</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {countries.reduce((sum, country) => sum + (country.city_count || 0), 0)}
                </Text>
                <Text style={styles.statLabel}>Cities</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {countries.filter(c => c.status === 'active').length}
                </Text>
                <Text style={styles.statLabel}>Countries</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.selectionGrid}>
            <Text style={styles.sectionTitle}>Choose Your Country</Text>
            {countries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </View>

          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>
              🌍 Don't see your country? We're working hard to expand globally. 
              Check back soon for updates!
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: Colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  selectionGrid: {
    gap: 15,
    marginBottom: 30,
  },
  selectionCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  disabledCard: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  cardFlag: {
    fontSize: 56,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.textLight,
  },
  activeIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeIndicatorText: {
    color: Colors.surface,
    fontSize: 10,
    fontWeight: '600',
  },
  comingSoonIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    color: Colors.surface,
    fontSize: 10,
    fontWeight: '600',
  },
  footerInfo: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CountryScreen;