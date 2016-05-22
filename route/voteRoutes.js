const render = require('../lib/render');
const route = require('koa-route');
const questions = require('../model/Question');
const votes = require('../model/Vote');
const parse = require('co-body');
const utils = require('./utils');

function* showAddVote() {
	const questionId = this.query.questionId;

	if (!questionId) {
		this.set('ErrorMessage', 'No questionId passed to the page');
		this.redirect('/');
		return;
	}

	const q = yield questions.findById(questionId);

	if (!q) {
		this.set('ErrorMessage', `No question found for id: '${questionId}'`);
		this.redirect('/');
		return;
	}

	const viewModel = {
		tagString: q.tags.join(', '),
		questionTitle: q.title,
		questionId
	};

	this.body = yield render('newVote', viewModel);
}

function* addVote() {
	const postedData = yield parse(this);
	const questionId = postedData.questionId;

	if (!questionId) {
		this.set('ErrorMessage', 'QuestionId required');
		this.redirect('/');
		return;
	}

	const vote = {
		tags: utils.splitAndTrimTagString(postedData.tagString),
		created_at: new Date,
		questionId,
		value: postedData.voteValue
	};

	const voteRecord = yield votes.insert(vote);

	this.redirect(`/vote/${voteRecord._id}/comment`);
}

function* showAddComment(id) {
	const vote = yield votes.findById(id);
	this.body = yield render('comment', {
		voteId: id
	});
}

function* addComment(id) {
	const postedData = yield parse(this);
	const vote = yield votes.findAndModify({
		_id: id,
	}, {
		$set: {
			comment: postedData.comment
		}
	});

	this.redirect(`/vote?questionId=${vote.questionId}`);
}

module.exports = app => {
	app.use(route.get('/vote', showAddVote));
	app.use(route.post('/vote', addVote));
	app.use(route.get('/vote/:id/comment', showAddComment));
	app.use(route.post('/vote/:id/comment', addComment));

	return app;
};