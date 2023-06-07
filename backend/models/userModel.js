const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  username: {
    type: String,
    required: [true, "A user must have a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
