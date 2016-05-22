const route = require('koa-route');
const parse = require('co-body');
const questions = require('../model/Question');
const votes = require('../model/Vote');
const render = require('../lib/render');
const utils = require('./utils');

function* showResults() {
	const questionList = yield questions.find({});

	this.body = yield render('result', {
		questions: questionList
	});
}

function* renderResultFile() {
	const postedData = yield parse(this);

	postedData.tags = utils.splitAndTrimTagString(postedData.tagString);
	const viewModel = {
		votes: yield getVotesForCriteria(postedData)
	};

	this.set('Content-Type', 'application/vnd.ms-excel');
	this.set('content-disposition', 'attachment;filename=results.xls');

	this.body = yield render('showResults', viewModel)
}

function* getVotesForCriteria(postedCriteria) {
	const filter = {};

	if (postedCriteria.questionTitle) {
		filter.questionTitle = postedCriteria.questionTitle;
	}

	if (postedCriteria.tags && postedCriteria.tags.length > 0) {
		filter.tags = {
			$in: postedCriteria.tags
		};
	}

	if (postedCriteria.from) {
		filter.created_at = {
			$gte: utils.yyyymmdd_to_date(postedCriteria.from)
		};
	}

	if (postedCriteria.to) {
		filter.created_at = filter.created_at || {};
		filter.created_at.$lte = utils.yyyymmdd_to_date(postedCriteria.to);
	}

	return yield votes.find(filter);
};

module.exports = app => {
	app.use(route.get('/results', showResults));
	app.use(route.post('/results', renderResultFile));

	return app;
};