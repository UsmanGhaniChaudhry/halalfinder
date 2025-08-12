import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import Header from '../components/Header';
import VenueCard from '../components/VenueCard';
import BottomNavigation from '../components/BottomNavigation';
import { Colors } from '../utils/Colors';

const VenuesScreen = ({
  // Data
  venues,
  favorites,
  selectedCountry,
  selectedCity,
  
  // UI State
  loading,
  error,
  searchText,
  activeFilter,
  
  // Functions
  navigateToScreen,
  goBack,
  toggleFavorite,
  openReviewsModal,
  openReviewFormModal,
  openInMaps,
  setSearchText,
  setActiveFilter,
  loadVenues,
}) => {

  // 🔧 FIXED: Auto-refresh when filter changes
  useEffect(() => {
    if (selectedCity && loadVenues) {
      console.log('🎯 VenuesScreen: Filter or search changed, reloading venues');
      console.log('🔄 Current values:', { searchText, activeFilter, cityId: selectedCity.id });
      loadVenues(selectedCity.id, searchText, activeFilter);
    }
  }, [searchText, activeFilter, selectedCity, loadVenues]);

  const LoadingSpinner = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading venues...</Text>
    </View>
  );

  const ErrorMessage = ({ message }) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>🔍</Text>
      <Text style={styles.errorTitle}>Search Error</Text>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadVenues(selectedCity.id, '', 'all')}>
        <Text style={styles.retryButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );

  // 🔧 FIXED: Filter tab component with proper state handling
  const FilterTab = ({ title, value, active, onPress }) => (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={() => {
        console.log('🎯 Filter tab pressed:', { title, value, currentActive: activeFilter });
        onPress();
      }}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const Breadcrumb = () => (
    <View style={styles.breadcrumb}>
      <TouchableOpacity onPress={() => navigateToScreen('country')}>
        <Text style={styles.breadcrumbLink}>Countries</Text>
      </TouchableOpacity>
      <Text style={styles.breadcrumbSeparator}> › </Text>
      <TouchableOpacity onPress={() => navigateToScreen('city')}>
        <Text style={styles.breadcrumbLink}>{selectedCountry?.name}</Text>
      </TouchableOpacity>
      <Text style={styles.breadcrumbSeparator}> › </Text>
      <Text style={styles.breadcrumbCurrent}>{selectedCity?.name}</Text>
    </View>
  );

  // 🔧 FIXED: Search section with proper filter tabs
  const SearchSection = () => (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search mosques & halal restaurants..."
          value={searchText}
          onChangeText={(text) => {
            console.log('🔍 Search text changed:', text);
            setSearchText(text);
          }}
          placeholderTextColor={Colors.textLight}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
      
      <View style={styles.filterTabs}>
        <FilterTab
          title="All"
          value="all"
          active={activeFilter === 'all'}
          onPress={() => {
            console.log('🎯 Setting filter to: all');
            setActiveFilter('all');
          }}
        />
        <FilterTab
          title="Mosques"
          value="mosque"
          active={activeFilter === 'mosque'}
          onPress={() => {
            console.log('🎯 Setting filter to: mosque');
            setActiveFilter('mosque');
          }}
        />
        <FilterTab
          title="Restaurants"
          value="restaurant"
          active={activeFilter === 'restaurant'}
          onPress={() => {
            console.log('🎯 Setting filter to: restaurant');
            setActiveFilter('restaurant');
          }}
        />
      </View>
    </View>
  );

  const LocationInfo = () => (
    <View style={styles.locationInfo}>
      <Text style={styles.locationInfoText}>
        📍 Showing results in {selectedCity?.name} • {venues.length} places found
      </Text>
    </View>
  );

  const NoResultsMessage = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsIcon}>🔍</Text>
      <Text style={styles.noResultsTitle}>No Venues Found</Text>
      <Text style={styles.noResultsText}>
        {searchText 
          ? `No results for "${searchText}". Try adjusting your search terms.`
          : activeFilter !== 'all'
            ? `No ${activeFilter === 'mosque' ? 'mosques' : 'restaurants'} found in ${selectedCity?.name}.`
            : `No venues found in ${selectedCity?.name}.`
        }
      </Text>
      
      <View style={styles.suggestionButtons}>
        {searchText && (
          <TouchableOpacity 
            style={styles.suggestionButton}
            onPress={() => setSearchText('')}
          >
            <Text style={styles.suggestionButtonText}>Clear Search</Text>
          </TouchableOpacity>
        )}
        
        {activeFilter !== 'all' && (
          <TouchableOpacity 
            style={styles.suggestionButton}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={styles.suggestionButtonText}>Show All Types</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Get filtered venue count for each type
  const mosqueCount = venues.filter(v => v.type === 'mosque').length;
  const restaurantCount = venues.filter(v => v.type === 'restaurant').length;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={selectedCity?.name || 'Stockholm'}
        subtitle="Mosques & Halal Restaurants"
        showBack={true}
        onBackPress={goBack}
      />

      <Breadcrumb />
      <SearchSection />
      <LocationInfo />

      {loading && <LoadingSpinner />}
      
      {error && !loading && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && (
        <>
          {venues.length === 0 ? (
            <NoResultsMessage />
          ) : (
            <ScrollView 
              style={styles.resultsContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🕌</Text>
                  <Text style={styles.statText}>{mosqueCount} Mosques</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🍽️</Text>
                  <Text style={styles.statText}>{restaurantCount} Restaurants</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>⭐</Text>
                  <Text style={styles.statText}>{favorites.length} Favorites</Text>
                </View>
              </View>

              {/* Venues List */}
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isFavorite={favorites.includes(venue.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpenReviews={openReviewsModal}
                  onOpenReviewForm={openReviewFormModal}
                  onOpenMaps={openInMaps}
                />
              ))}

              {/* Bottom Spacing for Navigation */}
              <View style={styles.bottomSpacing} />
            </ScrollView>
          )}
        </>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        activeScreen="venues"
        onNavigate={(screen) => {
          if (screen === 'map') {
            navigateToScreen('map');
          } else if (screen === 'favorites') {
            navigateToScreen('favorites');
          }
        }}
        venueCount={venues.length}
        favoriteCount={favorites.length}
      />
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
  searchSection: {
    padding: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    position: 'relative',
    marginBottom: 15,
  },
  searchInput: {
    width: '100%',
    padding: 15,
    paddingRight: 45,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -9,
    fontSize: 18,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontWeight: '500',
    color: Colors.text,
    fontSize: 14,
  },
  tabTextActive: {
    color: Colors.surface,
  },
  locationInfo: {
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  locationInfoText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
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
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 15,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  suggestionButtons: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  suggestionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  suggestionButtonText: {
    color: Colors.surface,
    fontWeight: '500',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 100, // Space for bottom navigation
  },
});

export default VenuesScreen;