const express = require('express');
const router = express.Router();

var employeeController = require('../controllers/employeeController');

module.exports = function (passport) {
// Response handling
  let response = {
    status: 200,
    data: [],
    message: null
  };


  var optionalAuthentication = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) {
        return next(err);
      }
      req.user = user;

      return next();
    })(req, res, next);
  };

  var isAuthenticated = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.status(401).json({
          data: null,
          error: null,
          msg: 'User Is Not Signed In!'
        });
      }
      req.user = user;

      return next();
    })(req, res, next);
  };

  var isNotAuthenticated = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) {
        return next(err);
      } else if (user) {
        return res.status(403).json({
          data: null,
          error: null,
          msg: 'User Is Already Signed In!'
        });
      }

      return next();
    })(req, res, next);
  };

// Get users
  router.get('/users', employeeController.getEmployees);

// signUp
  router.post('/signup',employeeController.signUp);


  module.exports = router;

  return router;

}
