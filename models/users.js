const mongoose = require("mongoose");
const Checks = require("./checks");
const helpers = require("../lib/helpers");
const config = require("../lib/config");
const userschema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (
          !value.match(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
          )
        )
          throw new Error("Invalid phone number");
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
    tosAgreement: {
      type: Boolean,
      required: true,
      validate(value) {
        if (!value) throw new Error("tos aggrement is required");
      },
    },
    checksCount: {
      type: Number,
      default: 0,
      validate(value) {
        if (value > process.env.maxChecks)
          throw new Error(
            `User exceeded max Check limit of ${process.env.maxChecks}`
          );
      },
    },
    tokens: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userschema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};
//   return userObject;
// };

// userschema.virtual("tasks", {
//   ref: "Tasks",
//   localField: "_id",
//   foreignField: "owner",
// });

//Generating tokens
userschema.methods.generateAuthToken = async function () {
  const user = this;
  const token = helpers.createRandomString(20);
  user.tokens = user.tokens.concat(token);
  await user.save();
  return token;
};

//Logging in a User
userschema.statics.findbyCredentials = async (phone, password) => {
  const user = await User.findOne({ phone });
  if (!user) {
    throw new Error("Unable to login");
  }
  const match = helpers.hash(password);

  if (match !== user.password) {
    throw new Error("Unable to login");
  }
  return user;
};

//deleting tasks for the user
userschema.pre("remove", async function (next) {
  const user = this;
  await Checks.deleteMany({ owner: user._id });
  next();
});

//Hashing the password before saving
userschema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = helpers.hash(user.password);
  }
  next();
});

const User = mongoose.model("Users", userschema);

module.exports = User;
