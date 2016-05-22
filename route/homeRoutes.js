const render = require('../lib/render');
const route = require('koa-route');

function* showHome() {
	this.body = yield render('home');
}

module.exports = app => {
	app.use(route.get('/', showHome));

	return app;
};