const router = require('express').Router();
const bcrypt = require('bcrypt');
const Users = require('../users/users-model');
const md = require('./auth-middleware');
const { hashPassword } = require('./auth-service');
// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
  router.post('/register', md.checkUsernameFree, md.checkPasswordLength, async (req, res, next) => { 
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      const hashedPassword = await hashPassword(password);
  
      const newUser = {
        username: username,
        password: hashedPassword
      };
  
      const savedUser = await Users.add(newUser); 
  
      res.status(201).json(savedUser);
    } catch (error) {
      next(error); 
    }
  });


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
  router.post('/login', md.checkUsernameExists, async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      const user = await Users.findBy({ username }).first();
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Ensure password and hashed password are passed correctly
      const match = await bcrypt.compare(password, user.password);
  
      if (match) {
        req.session.user = {
          user_id: user.user_id,
          username: user.username
        };

        res.json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  });



  router.get('/logout', (req, res, next) => {
    if (req.session && req.session.user) {
      req.session.destroy(err => {
        if (err) {
          return next(err);
        }
        res.json({ message: 'Logged out' });
      });
    } else {
      res.json({ message: 'No session' });
    }
  });
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;