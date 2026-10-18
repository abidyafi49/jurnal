const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Judul wajib diisi"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Konten wajib diisi"],
  },
  category: {
    type: String,
    enum: ["python", "ros", "rl", "korean", "english", "daily", "other"],
    default: "daily",
    },
    isPublished: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Post', postSchema);