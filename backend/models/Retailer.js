const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const RetailerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // Use UUID for _id
    },
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: true,
      enum: ['GROCERY', 'MEDICINE', 'ELECTRONICS', 'CLOTHING', 'OTHER'], // Added more examples
    },
    phoneNumber: {
      type: String,
      required: true,
      // Basic E.164 pattern check (can be more robust)
      match: /^\+[1-9]\d{1,14}$/,
    },
    address: {
      type: String,
      required: true,
    },
    // GeoJSON Point for MongoDB geospatial queries
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude] order
        required: true,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    _id: false, // Disable default _id generation since we use our own UUID
    toJSON: { // Transform output to match spec (id instead of _id)
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            // Optionally format location back to lat/lng fields if needed by frontend
            // ret.latitude = ret.location.coordinates[1];
            // ret.longitude = ret.location.coordinates[0];
            // delete ret.location;
        }
    },
    toObject: { // Ensure virtuals are included if we add any
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
  }
);

// Index for geospatial queries
RetailerSchema.index({ location: '2dsphere' });

// Compound index for filtering and potentially sorting
RetailerSchema.index({ category: 1 });

RetailerSchema.index({ name: 'text' }); 

const Retailer = mongoose.model('Retailer', RetailerSchema);

module.exports = Retailer;