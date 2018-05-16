// -------------------------- Requirements ------------------------------- //
var config = require('../config/environmentConfig');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JWTStrategy = require('passport-jwt').Strategy;
var User = require('../models/employee');
// -------------------------- End of "Requirements" ---------------------- //

module.exports = function (passport) {
    passport.use(new JWTStrategy(
        {
            'jwtFromRequest': ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            'secretOrKey': config.SECRET
        },
        function (jwtPayload, done) {
            User.findById(jwtPayload.id, function (err, user) {
                return done(err, user);
            });
        }
    ));

};

module.exports.getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }

        return null;
    }

    return null;
};
