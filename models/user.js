var mongoose = require("mongoose");
// var Date = require("Date");

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      async validator(value) {
        const emailexist = await checkEmailExists(User, value);
        return !emailexist;
      },
      message: "Email already exists",
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  registrationdate: {
    type: Date,
    default : Date.now(),
  },

  //Add "tasks" which will be an array of task model. (will contain reference to task that belongs to this user)

  tasks : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'task'
  }]

});

const User = mongoose.model("User", userSchema);

async function checkEmailExists(User, email) {
  const count = await User.countDocuments({ email });
  return count !== 0;
}

module.exports = User;
