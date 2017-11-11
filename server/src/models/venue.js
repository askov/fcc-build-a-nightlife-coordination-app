const mongoose = require('mongoose');

const venueSchema = mongoose.Schema({
  user_account: {
    type: String,
    required: true
  },
  business_id: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

venueSchema.index({user_account: 1, business_id: 1}, {unique: true});

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
