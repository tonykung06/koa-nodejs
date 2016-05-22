const render = require('../lib/render');
const route = require('koa-route');
const questions = require('../model/Question');
const parse = require('co-body');
const utils = require('./utils');

function* showNewQuestion() {
	this.body = yield render('newQuestion');
}

function* showQuestion(id) {
	var q = yield questions.findById(id);
	var viewModel = {
		id: q._id.toString(),
		questionTitle: q.title,
		tagString: q.tags.join(', ')
	};

	this.body = yield render('showQuestion', viewModel);
}

function* addNewQuestion() {
	const postedData = yield parse(this);
	const question = {
		title: postedData.questionTitle,
		tags: utils.splitAndTrimTagString(postedData.tagString)
	};

	const result = yield questions.insert(question);

	this.redirect(`/question/${result._id}`);
}

function* updateQuestion(id) {
	const postedData = yield parse(this);
	const question = {
		title: postedData.questionTitle,
		tags: utils.splitAndTrimTagString(postedData.tagString)
	};

	yield questions.updateById(id, question);

	this.redirect(`/question/${id}`);
}

module.exports = app => {
	app.use(route.get('/question', showNewQuestion));
	app.use(route.get('/question/:id', showQuestion));
	app.use(route.post('/question/:id', updateQuestion));
	app.use(route.post('/question', addNewQuestion));

	return app;
};