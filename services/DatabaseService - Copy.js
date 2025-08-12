// Database Service - Handles all Supabase interactions with FIXED FILTERING
const SUPABASE_URL = 'https://robmckkdyldutllljghf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYm1ja2tkeWxkdXRsbGxqZ2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzgwNDcsImV4cCI6MjA2NTkxNDA0N30.eWETq-_1p5ztb6Qh5WiSoaXpqVdsWdUexmSX2cQgqfw';

// Simple Supabase client
class SimpleSupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async query(table, options = {}) {
    const { select = '*', eq, order, rpc, params } = options;
    
    let endpoint;
    let body = null;
    
    if (rpc) {
      endpoint = `${this.url}/rest/v1/rpc/${rpc}`;
      body = JSON.stringify(params || {});
    } else {
      endpoint = `${this.url}/rest/v1/${table}?select=${select}`;
      
      if (eq) {
        Object.keys(eq).forEach(key => {
          endpoint += `&${key}=eq.${eq[key]}`;
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

// Database Service class with FIXED FILTERING
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

  // 🔧 FIXED: Venues with proper filtering
  static async getVenuesByCity(cityId, searchTerm = '', venueType = null) {
    console.log('🔍 DatabaseService.getVenuesByCity called with:', {
      cityId,
      searchTerm,
      venueType
    });

    // Build query options
    let options = { 
      eq: { city_id: cityId }, 
      order: 'name' 
    };
    
    // 🎯 KEY FIX: Add venue type filter to database query
    if (venueType && venueType !== 'all') {
      options.eq.type = venueType;
      console.log('🎯 Adding type filter:', venueType);
    }
    
    console.log('📊 Query options:', options);
    
    const result = await supabase.query('venues', options);
    
    console.log('📋 Database result:', {
      success: !result.error,
      count: result.data?.length || 0,
      error: result.error
    });
    
    // 🔧 ADDITIONAL FIX: Client-side search filtering
    if (result.data && searchTerm) {
      console.log('🔍 Applying search filter for:', searchTerm);
      const originalCount = result.data.length;
      
      result.data = result.data.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log(`🔍 Search filtered: ${originalCount} → ${result.data.length} venues`);
    }
    
    // 🎯 FINAL CHECK: Log what types are being returned
    if (result.data) {
      const types = result.data.map(v => v.type);
      const mosqueCount = types.filter(t => t === 'mosque').length;
      const restaurantCount = types.filter(t => t === 'restaurant').length;
      
      console.log('📊 Final result breakdown:', {
        total: result.data.length,
        mosques: mosqueCount,
        restaurants: restaurantCount,
        expectedType: venueType || 'all'
      });
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