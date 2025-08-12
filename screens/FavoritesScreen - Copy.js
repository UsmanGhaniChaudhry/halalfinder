import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import Header from '../components/Header';
import VenueCard from '../components/VenueCard';
import BottomNavigation from '../components/BottomNavigation';
import DatabaseService from '../services/DatabaseService';
import { Colors } from '../utils/Colors';

const FavoritesScreen = ({
  // Data
  favorites,
  
  // Functions
  navigateToScreen,
  toggleFavorite,
  openReviewsModal,
  openReviewFormModal,
  openInMaps,
}) => {
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, mosque, restaurant

  const loadFavoriteVenues = React.useCallback(async () => {
    if (favorites.length === 0) {
      setFavoriteVenues([]);
      return;
    }

    setLoading(true);
    try {
      // Get all venues and filter by favorites
      const result = await DatabaseService.getVenuesByCity(null); // Get all venues
      if (result.data) {
        const favVenues = result.data.filter(venue => favorites.includes(venue.id));
        setFavoriteVenues(favVenues);
      }
    } catch (error) {
      console.error('Error loading favorite venues:', error);
    } finally {
      setLoading(false);
    }
  }, [favorites]); // Add dependencies for useCallback

  // Load favorite venues when component mounts or favorites change
  useEffect(() => {
    loadFavoriteVenues();
  }, [loadFavoriteVenues]); // Now include loadFavoriteVenues as dependency

  const clearAllFavorites = () => {
    Alert.alert(
      'Clear All Favorites?',
      'This will remove all saved venues from your favorites. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => {
            favorites.forEach(venueId => toggleFavorite(venueId));
          }
        }
      ]
    );
  };

  // Filter venues by type
  const getFilteredVenues = () => {
    if (filter === 'all') return favoriteVenues;
    return favoriteVenues.filter(venue => venue.type === filter);
  };

  // Group venues by type
  const mosques = favoriteVenues.filter(venue => venue.type === 'mosque');
  const restaurants = favoriteVenues.filter(venue => venue.type === 'restaurant');

  const FilterTab = ({ title, value, active, count }) => (
    <TouchableOpacity
      style={[styles.filterTab, active && styles.filterTabActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
        {title}
      </Text>
      {count !== undefined && (
        <View style={[styles.countBadge, active && styles.countBadgeActive]}>
          <Text style={[styles.countBadgeText, active && styles.countBadgeTextActive]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateIcon}>💔</Text>
      <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyStateText}>
        Start exploring venues and tap the heart icon to save your favorite mosques and restaurants here!
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigateToScreen('country')}
      >
        <Text style={styles.exploreButtonText}>🏠 Explore Venues</Text>
      </TouchableOpacity>
    </View>
  );

  const CategorySection = ({ title, icon, venues, showDivider = true }) => {
    if (venues.length === 0) return null;

    return (
      <>
        {showDivider && <View style={styles.sectionDivider} />}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{icon}</Text>
          <Text style={styles.categoryTitle}>{title} ({venues.length})</Text>
        </View>
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            isFavorite={true} // All venues here are favorites
            onToggleFavorite={toggleFavorite}
            onOpenReviews={openReviewsModal}
            onOpenReviewForm={openReviewFormModal}
            onOpenMaps={openInMaps}
          />
        ))}
      </>
    );
  };

  const LoadingSpinner = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading your favorites...</Text>
    </View>
  );

  const filteredVenues = getFilteredVenues();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Favorites"
        subtitle={`${favorites.length} saved places`}
        showBack={false}
      />

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          <View style={styles.filterTabs}>
            <FilterTab
              title="All"
              value="all"
              active={filter === 'all'}
              count={favoriteVenues.length}
            />
            <FilterTab
              title="🕌 Mosques"
              value="mosque"
              active={filter === 'mosque'}
              count={mosques.length}
            />
            <FilterTab
              title="🍽️ Restaurants"
              value="restaurant"
              active={filter === 'restaurant'}
              count={restaurants.length}
            />
          </View>
        </ScrollView>
      </View>

      {/* Info Banner */}
      <View style={styles.locationInfo}>
        <Text style={styles.locationInfoText}>
          ⭐ Your saved mosques and halal restaurants from all cities
        </Text>
      </View>

      {loading && <LoadingSpinner />}

      {!loading && (
        <ScrollView 
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {favorites.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Header with actions */}
              <View style={styles.favoritesHeader}>
                <Text style={styles.favoritesCount}>
                  {filteredVenues.length} favorite{filteredVenues.length !== 1 ? 's' : ''}
                  {filter !== 'all' && ` • ${filter === 'mosque' ? 'Mosques' : 'Restaurants'}`}
                </Text>
                {favorites.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearAllButton}
                    onPress={clearAllFavorites}
                  >
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Filtered Results */}
              {filter === 'all' ? (
                <>
                  <CategorySection
                    title="Mosques"
                    icon="🕌"
                    venues={mosques}
                    showDivider={false}
                  />
                  <CategorySection
                    title="Restaurants"
                    icon="🍽️"
                    venues={restaurants}
                  />
                </>
              ) : (
                <>
                  {filteredVenues.length === 0 ? (
                    <View style={styles.noFilterResultsContainer}>
                      <Text style={styles.noFilterResultsIcon}>
                        {filter === 'mosque' ? '🕌' : '🍽️'}
                      </Text>
                      <Text style={styles.noFilterResultsTitle}>
                        No {filter === 'mosque' ? 'Mosques' : 'Restaurants'} Saved
                      </Text>
                      <Text style={styles.noFilterResultsText}>
                        You haven't saved any {filter === 'mosque' ? 'mosques' : 'restaurants'} yet. 
                        Explore venues and tap the heart icon to add them here!
                      </Text>
                    </View>
                  ) : (
                    filteredVenues.map((venue) => (
                      <VenueCard
                        key={venue.id}
                        venue={venue}
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                        onOpenReviews={openReviewsModal}
                        onOpenReviewForm={openReviewFormModal}
                        onOpenMaps={openInMaps}
                      />
                    ))
                  )}
                </>
              )}

              {/* Bottom Spacing */}
              <View style={styles.bottomSpacing} />
            </>
          )}
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        activeScreen="favorites"
        onNavigate={(screen) => {
          if (screen === 'venues') {
            navigateToScreen('venues');
          } else if (screen === 'map') {
            navigateToScreen('map');
          }
        }}
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
  filterSection: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 15,
  },
  filterScrollView: {
    paddingHorizontal: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  filterTabTextActive: {
    color: Colors.surface,
  },
  countBadge: {
    backgroundColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  countBadgeTextActive: {
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: Colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  favoritesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  favoritesCount: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  clearAllButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffebee',
  },
  clearAllText: {
    color: Colors.error,
    fontWeight: '500',
    fontSize: 14,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  noFilterResultsContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  noFilterResultsIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  noFilterResultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  noFilterResultsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 100, // Space for bottom navigation
  },
});

export default FavoritesScreen;