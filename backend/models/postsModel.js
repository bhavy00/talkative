const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  comments: {
    type: mongoose.Schema.Types.Array,
    default: [],
  },
  likes: {
    type: Number,
    default: 0
  }
});

const Posts = mongoose.model("Posts", postsSchema);

module.exports = Posts;
