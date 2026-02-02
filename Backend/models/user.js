const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// ✅ Call plugin on the SCHEMA, not the Model
userSchema.plugin(passportLocalMongoose);

// Create the Model AFTER applying the plugin
const User = mongoose.model("User", userSchema);

module.exports = User;