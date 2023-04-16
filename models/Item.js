const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxLength: [500, "Can not be more than 500 characters"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const ItemSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      maxLength: 100,
    },
    itemDescription: {
      type: String,
      required: true,
      maxLength: 2000,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "male", "female"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isClearance: {
      type: Boolean,
      default: false,
    },
    colors: {
      type: [String],
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    ratings: [RatingSchema],
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// ItemSchema.pre('save', function(next) {
//   this.gender = this.gender.toUpperCase();

//   next();
// })

module.exports = mongoose.model("Item", ItemSchema);
