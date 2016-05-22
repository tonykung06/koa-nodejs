const db = require('../lib/db');
const wrap = require('co-monk');
const questions = wrap(db.get('questions'));

module.exports = questions;