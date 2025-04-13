const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Book',
      required: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100, // Approximately 25 words
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only review a book once
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 