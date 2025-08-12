import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/Colors';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  size = 20, 
  readonly = false,
  maxRating = 5,
  color = '#ffc107',
  emptyColor = '#ddd'
}) => {
  const [tempRating, setTempRating] = useState(rating);
  
  // Update tempRating when rating prop changes
  useEffect(() => {
    setTempRating(rating);
  }, [rating]);

  const handleStarPress = (starIndex) => {
    if (!readonly && onRatingChange) {
      const newRating = starIndex;
      setTempRating(newRating);
      onRatingChange(newRating);
    }
  };

  const renderStar = (index) => {
    const starIndex = index + 1;
    const isFilled = starIndex <= (tempRating || rating);
    
    if (readonly) {
      return (
        <View key={index} style={[styles.starContainer, { padding: 1 }]}>
          <Text style={[
            styles.star, 
            { 
              fontSize: size, 
              color: isFilled ? color : emptyColor 
            }
          ]}>
            ⭐
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(starIndex)}
        style={[styles.starContainer, { padding: 2 }]}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.star, 
          { 
            fontSize: size, 
            color: isFilled ? color : emptyColor 
          }
        ]}>
          ⭐
        </Text>
      </TouchableOpacity>
    );
  };

  const stars = [];
  for (let i = 0; i < maxRating; i++) {
    stars.push(renderStar(i));
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {stars}
      </View>
      {!readonly && onRatingChange && (
        <Text style={[
          styles.ratingText, 
          { fontSize: size * 0.8 }
        ]}>
          {tempRating || rating} / {maxRating}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    textAlign: 'center',
  },
  ratingText: {
    marginLeft: 10,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default StarRating;