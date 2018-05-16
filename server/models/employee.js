var mongoose = require('mongoose');
var REGEX = require('../../node_modules/regex');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;


// function to generateJWTToken and expires after certain amount of time
var generateJWTToken = function (id, time, callback) {
  callback('JWT ' + jwt.sign(
    { 'id': id },
    config.SECRET,
    { expiresIn: time }
  ));
};

var employeeSchema = Schema({

/*
 *  employee Schema
 */
  address: {
    index: true,
    lowercase: true,
    sparse: true,
    type: String
  },
  avatar: {
    default: '../../../assets/images/defaultProfilePic.png',
    type: String
  },
  birthdate: Date,
  email: {
    lowercase: true,
    match: REGEX.MAIL_REGEX,
    required: true,
    trim: true,
    type: String,
    unique: true
  },
  firstName: {
    index: true,
    required: true,
    sparse: true,
    type: String
  },
  isHR: {
    default: false,
    type: Boolean
  },
  lastName: {
    index: true,
    required: true,
    sparse: true,
    type: String
  },
  salary: Number
  ,
  password: String,
  phone: {
    match: REGEX.PHONE_REGEX,
    required: true,
    trim: true,
    type: [String]
  },
  username: {
    index: true,
    lowercase: true,
    sparse: true,
    trim: true,
    type: String,
    unique: true
  },

});

// hashing the passwords
employeeSchema.pre('save', function (next) {
  var user = this;
  hash(user.password, function (err, hash) {
    if (err) {
      return next(err);
    }

    user.password = hash;

    return next();
  });
});
// helper to hash the password
var hash = function(password, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return callback(err, null);
    }
    bcrypt.hash(password, salt, function(err2, hash) {
      callback(err2, hash);
    });
  });
};


// compare passwords
employeeSchema.methods.comparePasswords = function (password, next) {
  comparePasswordToHash(password, this.password, function (
    err,
    passwordMatches
  ) {
    if (err) {
      return next(err);
    }

    return next(null, passwordMatches);
  });
};
// helper
var comparePasswordToHash = function(
  candidatePassword,
  hash,
  callback
) {
  bcrypt.compare(candidatePassword, hash, function(err, matches) {
    callback(err, matches);
  });
};

var employee = mongoose.model('employee', employeeSchema, 'employee');
