const db = require('../lib/db');
const wrap = require('co-monk');
const votes = wrap(db.get('votes'));

module.exports = votes;