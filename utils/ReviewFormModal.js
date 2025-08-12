import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import StarRating from '../components/StarRating';
import DatabaseService from '../services/DatabaseService';
import { Colors } from './Colors';

const ReviewFormModal = ({ visible, venue, onClose, onSubmitSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!userName.trim() || !comment.trim()) {
      Alert.alert('Missing Information', 'Please fill in your name and review comment.');
      return;
    }

    setSubmitting(true);

    const reviewData = {
      venue_id: venue.id,
      user_name: userName.trim(),
      rating,
      comment: comment.trim(),
      visit_date: new Date().toISOString().split('T')[0],
      is_verified: false,
    };

    try {
      const result = await DatabaseService.submitReview(reviewData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      Alert.alert(
        'Review Submitted! 🎉',
        'Thank you for sharing your experience!',
        [{ text: 'Great!', onPress: () => {
          setRating(5);
          setComment('');
          setUserName('');
          onClose();
          if (onSubmitSuccess) onSubmitSuccess();
        }}]
      );

    } catch (error) {
      Alert.alert('Submission Failed', 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible || !venue) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} disabled={submitting}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Review {venue.name}</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Enter your name"
              editable={!submitting}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Rating *</Text>
            <View style={styles.ratingContainer}>
              <StarRating 
                rating={rating} 
                onRatingChange={submitting ? null : setRating} 
                size={32}
              />
              <Text style={styles.ratingText}>
                {rating === 5 ? 'Excellent!' : 
                 rating === 4 ? 'Very Good' : 
                 rating === 3 ? 'Good' : 
                 rating === 2 ? 'Fair' : 'Poor'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Your Review *</Text>
            <TextInput
              style={styles.textArea}
              value={comment}
              onChangeText={setComment}
              placeholder="Share your experience..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!submitting}
              maxLength={500}
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, submitting && styles.submitDisabled]} 
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <View style={styles.submitContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.submitText}>Submitting...</Text>
              </View>
            ) : (
              <Text style={styles.submitText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  spacer: {
    width: 60,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  ratingText: {
    marginTop: 8,
    color: '#4CAF50',
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitDisabled: {
    backgroundColor: '#ccc',
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewFormModal;