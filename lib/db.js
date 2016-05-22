const monk = require('monk');
const environment = process.env.NODE_ENV || 'dev';

module.exports = monk(`localhost/${environment}_koa_nodejs`);