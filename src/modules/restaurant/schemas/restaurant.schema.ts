import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  // Add a location field for geospatial indexing and queries
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
  },
});

// Create a 2dsphere index on the location field for geospatial queries
RestaurantSchema.index({ location: '2dsphere' });

RestaurantSchema.pre('save', function (next) {
  const latitude = this.get('latitude');
  const longitude = this.get('longitude');

  if (latitude !== undefined && longitude !== undefined) {
    this.set('location', {
      type: 'Point',
      coordinates: [longitude, latitude],
    });
  }

  next();
});

export default RestaurantSchema;