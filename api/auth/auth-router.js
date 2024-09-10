const router = require('express').Router()
const Users = require('../users/users-model')
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
  router.post('/register', async (req, res, next) => { // Added 'async' keyword here
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
  
  
      const newUser = {
        username: username,
        password: password
      };
  
      // Save the user to the database
      const savedUser = await Users.add(newUser); // Assuming add() resolves to { user_id, username }
  
      // Return the newly created user (excluding password)
      res.status(201).json(savedUser);
    } catch (error) {
      next(error); // Forward errors to the error handler
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
  router.post('/login', (req, res) => {
    res.json('auth logged in correctly')
  })

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;