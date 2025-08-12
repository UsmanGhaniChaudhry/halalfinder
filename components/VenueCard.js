import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StarRating from './StarRating';
import { Colors, ColorHelpers } from '../utils/Colors';

const VenueCard = ({ 
  venue, 
  isFavorite, 
  onToggleFavorite, 
  onOpenReviews, 
  onOpenReviewForm, 
  onOpenMaps 
}) => {
  const displayRating = venue.overall_rating || venue.rating || 0;
  const displayReviewCount = venue.total_reviews || venue.review_count || 0;

  const handleReviewPress = () => {
    console.log('Review button pressed for:', venue.name);
    onOpenReviews(venue);
  };

  return (
    <View style={styles.venueCard}>
      {/* Header */}
      <View style={styles.venueHeader}>
        <View style={styles.venueInfo}>
          <View style={[
            styles.venueType,
            venue.type === 'mosque' ? styles.mosqueType : styles.restaurantType
          ]}>
            <Text style={[
              styles.venueTypeText,
              venue.type === 'mosque' ? styles.mosqueTypeText : styles.restaurantTypeText
            ]}>
              {venue.type === 'mosque' ? 'Mosque' : 'Restaurant'}
              {venue.verified_status ? ' ✓' : ''}
            </Text>
          </View>
          <Text style={styles.venueName}>{venue.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(venue.id)}
        >
          <Text style={[
            styles.favoriteIcon,
            isFavorite && styles.favoriteIconActive
          ]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Address */}
      <Text style={styles.venueAddress}>{venue.address}</Text>
      
      {/* Distance */}
      {venue.distance_km && (
        <Text style={styles.venueDistance}>
          📍 {venue.distance_km} km away
        </Text>
      )}

      {/* Rating Section */}
      <View style={styles.ratingSection}>
        <View style={styles.mainRating}>
          <StarRating rating={Math.round(displayRating)} readonly size={16} />
          <Text style={styles.ratingText}>
            {displayRating.toFixed(1)}
          </Text>
          {venue.recent_reviews > 0 && (
            <Text style={styles.recentReviews}>
              {venue.recent_reviews} recent
            </Text>
          )}
        </View>
        
        {/* Separate review button */}
        <View style={styles.reviewButtonContainer}>
          <TouchableOpacity 
            onPress={handleReviewPress}
            style={styles.reviewButton}
            activeOpacity={0.8}
          >
            <Text style={styles.reviewButtonText}>
              📝 {displayReviewCount} Reviews - Tap to read
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category-specific ratings */}
        {venue.type === 'mosque' && (
          <View style={styles.categoryRatings}>
            {venue.prayer_facilities_rating > 0 && (
              <View style={styles.categoryRating}>
                <Text style={styles.categoryLabel}>🕌 Prayer facilities</Text>
                <StarRating rating={Math.round(venue.prayer_facilities_rating)} readonly size={12} />
                <Text style={styles.categoryRatingText}>{venue.prayer_facilities_rating.toFixed(1)}</Text>
              </View>
            )}
            {venue.cleanliness_rating > 0 && (
              <View style={styles.categoryRating}>
                <Text style={styles.categoryLabel}>🧽 Cleanliness</Text>
                <StarRating rating={Math.round(venue.cleanliness_rating)} readonly size={12} />
                <Text style={styles.categoryRatingText}>{venue.cleanliness_rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        )}

        {venue.type === 'restaurant' && (
          <View style={styles.categoryRatings}>
            {venue.halal_certification_rating > 0 && (
              <View style={styles.categoryRating}>
                <Text style={styles.categoryLabel}>🏷️ Halal certified</Text>
                <StarRating rating={Math.round(venue.halal_certification_rating)} readonly size={12} />
                <Text style={styles.categoryRatingText}>{venue.halal_certification_rating.toFixed(1)}</Text>
              </View>
            )}
            {venue.food_quality_rating > 0 && (
              <View style={styles.categoryRating}>
                <Text style={styles.categoryLabel}>🍽️ Food quality</Text>
                <StarRating rating={Math.round(venue.food_quality_rating)} readonly size={12} />
                <Text style={styles.categoryRatingText}>{venue.food_quality_rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.venueActions}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => onOpenMaps(venue)}
        >
          <Text style={styles.btnPrimaryText}>📍 Open in Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => onOpenReviewForm(venue)}
        >
          <Text style={styles.btnSecondaryText}>⭐ Add Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  venueCard: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  venueInfo: {
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#ddd',
  },
  favoriteIconActive: {
    color: Colors.favorite,
  },
  venueType: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  mosqueType: {
    backgroundColor: Colors.mosqueLight,
  },
  restaurantType: {
    backgroundColor: Colors.restaurantLight,
  },
  venueTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mosqueTypeText: {
    color: Colors.mosque,
  },
  restaurantTypeText: {
    color: Colors.restaurant,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 5,
  },
  venueAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 20,
  },
  venueDistance: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  ratingSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  mainRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recentReviews: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  reviewButtonContainer: {
    marginTop: 8,
    width: '100%',
  },
  reviewButton: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryRatings: {
    gap: 4,
    marginTop: 8,
  },
  categoryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    width: 100,
  },
  categoryRatingText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  venueActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
  btnPrimaryText: {
    color: Colors.surface,
    fontWeight: '500',
    fontSize: 14,
  },
  btnSecondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnSecondaryText: {
    color: Colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
});

export default VenueCard;