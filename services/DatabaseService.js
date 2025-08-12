// Database Service - Handles all Supabase interactions
const SUPABASE_URL = 'https://robmckkdyldutllljghf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYm1ja2tkeWxkdXRsbGxqZ2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzgwNDcsImV4cCI6MjA2NTkxNDA0N30.eWETq-_1p5ztb6Qh5WiSoaXpqVdsWdUexmSX2cQgqfw';

// Simple Supabase client
class SimpleSupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async query(table, options = {}) {
    const { select = '*', eq, order, rpc, params, in: inClause } = options;
    
    let endpoint;
    let body = null;
    
    if (rpc) {
      endpoint = `${this.url}/rest/v1/rpc/${rpc}`;
      body = JSON.stringify(params || {});
    } else {
      endpoint = `${this.url}/rest/v1/${table}?select=${select}`;
      
      if (eq) {
        Object.keys(eq).forEach(key => {
          if (eq[key] !== null) { // Only add if not null
            endpoint += `&${key}=eq.${eq[key]}`;
          }
        });
      }
      
      // Add support for IN clause (for getting multiple venues by IDs)
      if (inClause) {
        Object.keys(inClause).forEach(key => {
          const values = inClause[key];
          if (Array.isArray(values) && values.length > 0) {
            endpoint += `&${key}=in.(${values.join(',')})`;
          }
        });
      }
      
      if (order) {
        endpoint += `&order=${order}`;
      }
    }

    try {
      const response = await fetch(endpoint, {
        method: rpc ? 'POST' : 'GET',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async insert(table, data) {
    try {
      const response = await fetch(`${this.url}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
}

// Initialize the client
const supabase = new SimpleSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database Service class
class DatabaseService {
  // Countries
  static async getCountries() {
    return await supabase.query('countries', { order: 'id' });
  }

  // Cities
  static async getCitiesByCountry(countryId) {
    return await supabase.query('cities', { 
      eq: { country_id: countryId },
      order: 'name'
    });
  }

  // Venues
  static async getVenuesByCity(cityId, searchTerm = '', venueType = null) {
    let options = { order: 'name' };
    
    // Only add city filter if cityId is provided
    if (cityId) {
      options.eq = { city_id: cityId };
    }
    
    if (venueType && venueType !== 'all') {
      options.eq = { ...options.eq, type: venueType };
    }
    
    const result = await supabase.query('venues', options);
    
    if (result.data && searchTerm) {
      result.data = result.data.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }

  // NEW: Get multiple venues by their IDs (for favorites)
  static async getVenuesByIds(venueIds) {
    if (!venueIds || venueIds.length === 0) {
      return { data: [], error: null };
    }

    return await supabase.query('venues', {
      in: { id: venueIds },
      order: 'name'
    });
  }

  // NEW: Get all venues (for when we need all venues across cities)
  static async getAllVenues(searchTerm = '', venueType = null) {
    let options = { order: 'name' };
    
    if (venueType && venueType !== 'all') {
      options.eq = { type: venueType };
    }
    
    const result = await supabase.query('venues', options);
    
    if (result.data && searchTerm) {
      result.data = result.data.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }

  // Nearby venues using RPC function
  static async getNearbyVenues(latitude, longitude, radiusKm = 10, venueType = null) {
    return await supabase.query('venues', {
      rpc: 'venues_within_radius',
      params: {
        search_lat: latitude,
        search_lng: longitude,
        radius_km: radiusKm,
        venue_type: venueType
      }
    });
  }

  // Reviews
  static async getVenueReviews(venueId, limit = 20) {
    return await supabase.query('reviews', {
      eq: { venue_id: venueId },
      order: 'created_at.desc',
      select: '*'
    });
  }

  static async submitReview(reviewData) {
    return await supabase.insert('reviews', reviewData);
  }

  // Favorites (if you want to store them server-side later)
  static async getUserFavorites(userId) {
    return await supabase.query('user_favorites', {
      eq: { user_id: userId },
      order: 'created_at.desc'
    });
  }

  static async addToFavorites(userId, venueId) {
    return await supabase.insert('user_favorites', {
      user_id: userId,
      venue_id: venueId
    });
  }

  static async removeFromFavorites(userId, venueId) {
    // For simplicity, using a query approach
    // In a real implementation, you'd use DELETE
    return { data: null, error: 'Delete not implemented in simple client' };
  }
}

export default DatabaseService;