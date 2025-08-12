import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Modal,
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import StarRating from '../components/StarRating';
import DatabaseService from '../services/DatabaseService';
import { Colors } from './Colors';

const ReviewsModal = ({ visible, venue, onClose, onOpenReviewForm }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReviews = React.useCallback(async () => {
    if (!venue) return;
    setLoading(true);
    
    try {
      const result = await DatabaseService.getVenueReviews(venue.id);
      
      if (!result.data || result.data.length === 0) {
        // Generate sample reviews for demo
        const sampleReviews = generateSampleReviews(venue);
        setReviews(sampleReviews);
      } else {
        setReviews(result.data);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      const sampleReviews = generateSampleReviews(venue);
      setReviews(sampleReviews);
    } finally {
      setLoading(false);
    }
  }, [venue]); // Add venue as dependency

  useEffect(() => {
    if (visible && venue) {
      loadReviews();
    }
  }, [visible, venue, loadReviews]); // Add loadReviews to dependencies

  const generateSampleReviews = (venue) => {
    if (venue.type === 'mosque') {
      return [
        {
          id: 1,
          user_name: 'Ahmed K.',
          rating: 5,
          comment: 'Excellent mosque with clean facilities and welcoming community. The prayer hall is spacious and well-maintained.',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_verified: true
        },
        {
          id: 2,
          user_name: 'Fatima M.',
          rating: 4,
          comment: 'Good location and friendly community. Sometimes gets crowded during Friday prayers but overall positive experience.',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          is_verified: false
        },
        {
          id: 3,
          user_name: 'Ibrahim S.',
          rating: 5,
          comment: 'Beautiful mosque with excellent Islamic education programs. Very welcoming to new Muslims.',
          created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          is_verified: true
        }
      ];
    } else {
      return [
        {
          id: 1,
          user_name: 'Omar A.',
          rating: 5,
          comment: 'Amazing halal restaurant! The food quality is outstanding and the service is quick. Highly recommend the lamb dishes.',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          is_verified: true
        },
        {
          id: 2,
          user_name: 'Aisha T.',
          rating: 4,
          comment: 'Great Middle Eastern food with authentic flavors. The staff is very friendly and knowledgeable about halal requirements.',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          is_verified: false
        },
        {
          id: 3,
          user_name: 'Yusuf H.',
          rating: 4,
          comment: 'Delicious food and good portions. The restaurant is clean and has a nice atmosphere. Perfect for family dining.',
          created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          is_verified: true
        }
      ];
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!visible || !venue) return null;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Reviews</Text>
            <Text style={styles.subtitle}>{venue.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              onClose();
              onOpenReviewForm();
            }}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.ratingSection}>
            <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
            <StarRating rating={Math.round(averageRating)} readonly size={20} />
            <Text style={styles.reviewCount}>
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.venueTypeBadge}>
            <Text style={styles.venueTypeText}>
              {venue.type === 'mosque' ? 'Mosque' : 'Restaurant'}
            </Text>
          </View>
        </View>

        {/* Reviews List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading reviews...</Text>
          </View>
        ) : (
          <ScrollView style={styles.reviewsList}>
            {reviews.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                <Text style={styles.emptyText}>
                  Be the first to share your experience at {venue.name}!
                </Text>
                <TouchableOpacity 
                  style={styles.firstReviewButton}
                  onPress={() => {
                    onClose();
                    onOpenReviewForm();
                  }}
                >
                  <Text style={styles.firstReviewButtonText}>✍️ Write First Review</Text>
                </TouchableOpacity>
              </View>
            ) : (
              reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.user_name}</Text>
                      <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
                    </View>
                    <View style={styles.reviewRating}>
                      <StarRating rating={review.rating} readonly size={14} />
                      <Text style={styles.ratingText}>{review.rating}/5</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  {review.is_verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓ Verified Visit</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  summary: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingSection: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  venueTypeBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  venueTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  reviewsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  firstReviewButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  firstReviewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  reviewRating: {
    alignItems: 'flex-end',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default ReviewsModal;