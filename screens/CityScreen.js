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

const CityScreen = ({
  // Data
  cities,
  selectedCountry,
  
  // UI State
  loading,
  error,
  
  // Functions
  navigateToScreen,
  goBack,
}) => {

  const LoadingSpinner = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading cities...</Text>
    </View>
  );

  const ErrorMessage = ({ message }) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>🏙️</Text>
      <Text style={styles.errorTitle}>No Cities Found</Text>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={goBack}>
        <Text style={styles.retryButtonText}>← Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const CityCard = ({ city }) => (
    <TouchableOpacity
      style={styles.selectionCard}
      onPress={() => navigateToScreen('venues', city)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardFlag}>🏙️</Text>
        <View style={styles.cardStats}>
          <View style={styles.statBadge}>
            <Text style={styles.statNumber}>{city.mosque_count + city.restaurant_count}</Text>
            <Text style={styles.statLabel}>total</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.cardTitle}>{city.name}</Text>
      
      <View style={styles.cardDetails}>
        <View style={styles.venueTypeRow}>
          <View style={styles.venueType}>
            <Text style={styles.venueTypeIcon}>🕌</Text>
            <Text style={styles.venueTypeText}>{city.mosque_count} mosques</Text>
          </View>
          <View style={styles.venueType}>
            <Text style={styles.venueTypeIcon}>🍽️</Text>
            <Text style={styles.venueTypeText}>{city.restaurant_count} restaurants</Text>
          </View>
        </View>
      </View>

      <View style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explore {city.name} →</Text>
      </View>
    </TouchableOpacity>
  );

  const Breadcrumb = () => (
    <View style={styles.breadcrumb}>
      <TouchableOpacity onPress={() => navigateToScreen('country')}>
        <Text style={styles.breadcrumbLink}>Countries</Text>
      </TouchableOpacity>
      <Text style={styles.breadcrumbSeparator}> › </Text>
      <Text style={styles.breadcrumbCurrent}>{selectedCountry?.name || 'Country'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={selectedCountry?.name || 'Sweden'}
        subtitle="Select a city"
        showBack={true}
        onBackPress={goBack}
      />
      
      <Breadcrumb />
      
      {loading && <LoadingSpinner />}
      
      {error && !loading && (
        <ErrorMessage message={error} />
      )}
      
      {!loading && !error && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {cities.length === 0 ? (
            <View style={styles.noCitiesContainer}>
              <Text style={styles.noCitiesIcon}>🏙️</Text>
              <Text style={styles.noCitiesTitle}>No Cities Available</Text>
              <Text style={styles.noCitiesText}>
                We're still adding cities to {selectedCountry?.name}. 
                Check back soon for updates!
              </Text>
            </View>
          ) : (
            <>
              {/* Country Overview */}
              <View style={styles.countryOverview}>
                <Text style={styles.countryFlag}>{selectedCountry?.flag_emoji}</Text>
                <Text style={styles.overviewTitle}>Explore {selectedCountry?.name}</Text>
                <Text style={styles.overviewSubtitle}>
                  Choose from {cities.length} cities with halal venues
                </Text>
                
                {/* Summary Stats */}
                <View style={styles.summaryStats}>
                  <View style={styles.summaryStatItem}>
                    <Text style={styles.summaryStatNumber}>
                      {cities.reduce((sum, city) => sum + city.mosque_count, 0)}
                    </Text>
                    <Text style={styles.summaryStatLabel}>🕌 Mosques</Text>
                  </View>
                  <View style={styles.summaryStatDivider} />
                  <View style={styles.summaryStatItem}>
                    <Text style={styles.summaryStatNumber}>
                      {cities.reduce((sum, city) => sum + city.restaurant_count, 0)}
                    </Text>
                    <Text style={styles.summaryStatLabel}>🍽️ Restaurants</Text>
                  </View>
                </View>
              </View>

              {/* Cities Grid */}
              <View style={styles.selectionGrid}>
                <Text style={styles.sectionTitle}>Cities Available</Text>
                {cities
                  .sort((a, b) => (b.mosque_count + b.restaurant_count) - (a.mosque_count + a.restaurant_count))
                  .map((city) => (
                    <CityCard key={city.id} city={city} />
                  ))}
              </View>

              {/* Help Section */}
              <View style={styles.helpSection}>
                <Text style={styles.helpTitle}>💡 Need Help?</Text>
                <Text style={styles.helpText}>
                  • Tap any city to browse mosques and halal restaurants
                  • Use the map view to see venues geographically
                  • Save favorites for quick access later
                </Text>
              </View>
            </>
          )}
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
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  breadcrumbLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  breadcrumbSeparator: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  breadcrumbCurrent: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
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
  countryOverview: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.surface,
    marginBottom: 10,
  },
  countryFlag: {
    fontSize: 48,
    marginBottom: 15,
  },
  overviewTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  overviewSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 25,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  summaryStatLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  summaryStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  selectionGrid: {
    paddingBottom: 20,
  },
  selectionCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardFlag: {
    fontSize: 32,
  },
  cardStats: {
    alignItems: 'flex-end',
  },
  statBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.surface,
    fontSize: 10,
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
  },
  cardDetails: {
    marginBottom: 15,
  },
  venueTypeRow: {
    flexDirection: 'row',
    gap: 20,
  },
  venueType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
  },
  venueTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  venueTypeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  noCitiesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  noCitiesIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  noCitiesTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  noCitiesText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  helpSection: {
    backgroundColor: Colors.background,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

export default CityScreen;