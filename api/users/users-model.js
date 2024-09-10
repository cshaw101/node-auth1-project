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
    return db('users').select('user_id', 'username', 'password').where(filter);
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
      .insert(user) 
      .then(() => {
        return db('users')
          .where({ username: user.username })
          .first(); 
      });
  }

module.exports = { find, findBy, findById, add };
