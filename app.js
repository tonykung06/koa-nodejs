const koa = require('koa');
const serve = require('koa-static');
const userRoutes = require('./route/userRoutes');
const homeRoutes = require('./route/homeRoutes');
const questionRoutes = require('./route/questionRoutes');
const voteRoutes = require('./route/voteRoutes');
const resultRoutes = require('./route/resultRoutes');

const app = koa();

app.use(serve(`${__dirname}/public`));

homeRoutes(app);
userRoutes(app);
questionRoutes(app);
voteRoutes(app);
resultRoutes(app);

module.exports = app;