const db = require('../lib/db');
const wrap = require('co-monk');
const users = wrap(db.get('users'));

module.exports = users;