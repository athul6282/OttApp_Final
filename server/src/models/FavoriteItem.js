import mongoose from "mongoose";

const favoriteItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    movieLink: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    posterPath: {
      type: String,
      trim: true,
      default: "",
    },
    releaseDate: {
      type: String,
      trim: true,
      default: "",
    },
    voteAverage: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

favoriteItemSchema.index({ user: 1, movieLink: 1 }, { unique: true });

export const FavoriteItem = mongoose.model("FavoriteItem", favoriteItemSchema);
