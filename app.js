const koa = require('koa');
const serve = require('koa-static');
const userRoutes = require('./route/userRoutes');
const homeRoutes = require('./route/homeRoutes');

const app = koa();

app.use(serve(`${__dirname}/public`));

homeRoutes(app);
userRoutes(app);

module.exports = app;