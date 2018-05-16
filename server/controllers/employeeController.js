
var mongoose = require('mongoose');
var employee = mongoose.model('employee');


// intializing  data validators
var isDate = function isDate(value) {
  if (!(value instanceof Date && !isNaN(value.valueOf()))) {
    throw new Error('Expected date value');
  }
};
var isString = function isString(value) {
  if (typeof value !== 'string') {
    throw new Error('Expected string value');
  }
};

var isNotEmpty = function notEmpty(value) {
  if (checkEmpty(value)) {
    throw new Error('Expected non-empty value');
  }
};

// checks if the value is empty if any type
function checkEmpty(value) {

  //Check cases
  if (typeof value === 'undefined') {
    return true;
  }
  else if (value === null || value === '' || value === 0) {
    return true;
  }
  else if (typeof value === 'string' && !value.match(/\S/)) {
    return true;
  }
  else if (Array.isArray(value)) {
    if (value.length === 0) {
      return true;
    }
  }
  else if (value instanceof Set || value instanceof Map) {
    if (value.size === 0) {
      return true;
    }
  }
  //Not empty
  return false;
};

// get employees
// TODO: send the employees to the front end
module.exports .getEmployees = function(req, res) {
  console.log('in server')
  let responseData = 'hello world';
  employee.find({}).find(function (result) {
    console.log(result);
  })
  let responce = {data: responseData}
  res.status(200).json(responce);
}

// signUp
module.exports.signUp = function(req, res) {

  var hashedPassword = null;

  // TODO: hash the password

  // TODO: assign the comming newEmployee to be added
  // creating an instance of the employee for testing
  var newEmployee = {
    address: req.body.address,
    avatar: req.body.avatar,
    birthdate: req.body.birthdate,
    email: req.body.email,
    firstName: req.body.firstName,
    isHR: false,
    lastName: req.body.lastName,
    salary: 0,
    password: hashedPassword,
    phone: req.body.phone,
    username: req.body.username
  }


  // the field that has an error
  var field = '';
  // validating the input
  try {

    field = 'First Name';
    isNotEmpty(newEmployee.firstName);
    isString(newEmployee.firstName);

    field = 'Last Name';
    isNotEmpty(newEmployee.lastName);
    isString(newEmployee.lastName);


    field = 'Address';
    isString(newEmployee.address ? newEmployee.address : '');

    field = 'Birthdate';
    isNotEmpty(newEmployee.birthdate);
    isDate(newEmployee.birthdate);

    field = 'Username';
    isNotEmpty(newEmployee.username);
    isString(newEmployee.username);

    field = 'Email';
    isNotEmpty(newEmployee.email);
    isString(newEmployee.email);

    field = 'Password';
    isNotEmpty(newEmployee.password);
    isString(newEmployee.password);

  } catch (err) {
    return res.status(422).json({
      data: null,
      err: null,
      msg: field + ': ' + err.message + '!'
    });
  }


  // adding the instance to the db
  employee.create(newEmployee, function(err, emp) {
    if (err) {
      return res.status(422).json({
        data: null,
        err: err,
        message: null
      });
    }
    console.log('employee created successfully.')
    res.status(201).json({
      data: employee,
      err: null,
      message: 'employee created successfully.'
    });
  })


}

// Sign In
// TODO: connect to the end point and apply passport
module.exports.signIn = function (req, res, next) {

  var field = '';
  try {

    field = 'Username';
    isNotEmpty(req.body.username);
    isString(req.body.username);

    field = 'Password';
    isNotEmpty(req.body.password);
    isString(req.body.password);

  } catch (err) {
    return res.status(422).json({
      data: null,
      err: null,
      msg: field + ': ' + err.message + '!'
    });
  }

  employee.findOne(
    {
      $or: [
        { 'email': req.body.username },
        { 'username': req.body.username }
      ]
    },
    function (err, user) {
      if (err) {
        throw err;
      } else if (!user) {
        return res.status(422).json({
          data: null,
          err: null,
          msg: 'Wrong Username/Email Or Password!'
        });
      }

      employee.comparePasswords(
        req.body.password,
        function (err2, passwordMatches) {
          if (err2) {
            throw err2;
          } else if (!passwordMatches) {
            return res.status(422).json({
              data: null,
              err: null,
              msg: 'Wrong Username/Email Or Password!'
            });
          }

          generateJWTToken(user._id, '12h', function (jwtToken) {
            return res.status(200).json({
              data: null,
              err: null,
              msg: 'Sign In Is Successful!',
              token: jwtToken
            });
          });
        }
      );
    }
  );

};
