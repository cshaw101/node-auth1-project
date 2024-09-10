const db = require('../../data/db-config');

/**
  Resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db('users').select('user_id', 'username');
}

/**
  Resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db('users').select('user_id', 'username').where(filter);
}

/**
  Resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db('users').select('user_id', 'username').where({ user_id }).first();
}

/**
  Resolves to the newly inserted user { user_id, username }
 */
  function add(user) {
    return db('users')
      .insert(user) // Insert the user into the database
      .then(() => {
        // After insertion, retrieve the newly inserted user
        return db('users')
          .where({ username: user.username }) // Adjust this condition if necessary
          .first(); // Retrieve the first matching user
      });
  }

module.exports = { find, findBy, findById, add };
