const render = require('../lib/render');
const route = require('koa-route');
const questions = require('../model/Question');

function* showHome() {
	const questionList = yield questions.find({});

	this.body = yield render('home', {
		questionList
	});
}

module.exports = app => {
	app.use(route.get('/', showHome));

	return app;
};