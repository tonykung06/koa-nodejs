const koa = require('koa');
const app = koa();
const userRoutes = require('./route/userRoutes');

userRoutes(app);

// app.use(function* () {
// 	this.body = 'Hello World!';
// });

module.exports = app;