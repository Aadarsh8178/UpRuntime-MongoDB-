const mongoose = require("mongoose");

const checksSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  userPhone: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    default: "unknown",
  },
  protocol: {
    type: String,
    required: true,
    lowercase: true,
    validate(value) {
      if (!["https", "http"].includes(value.toLowerCase()))
        throw new Error("given protocol is not allowed");
    },
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  method: {
    type: String,
    required: true,
    lowercase: true,
    validate(value) {
      if (!["get", "put", "post", "delete"].includes(value.toLowerCase()))
        throw new Error("given http method is not supported");
    },
  },
  successCodes: [
    {
      type: Number,
      required: true,
    },
  ],
  lastChecked: {
    type: Date,
    defaut: false,
  },
  timeoutSeconds: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 1 || value > 5)
        throw new Error("timeout seconds range is 1-5");
    },
  },
});

const Checks = mongoose.model("Checks", checksSchema);

module.exports = Checks;
