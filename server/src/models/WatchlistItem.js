import mongoose from "mongoose";

const watchlistItemSchema = new mongoose.Schema(
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
    trailerLink: {
      type: String,
      trim: true,
      default: "",
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

watchlistItemSchema.index({ user: 1, movieLink: 1 }, { unique: true });

export const WatchlistItem = mongoose.model(
  "WatchlistItem",
  watchlistItemSchema
);
