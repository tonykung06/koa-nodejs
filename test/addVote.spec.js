'use strict';

const app = require('../app');
const should = require('should');
const co = require('co');
const questions = require('../model/Question');
const votes = require('../model/Vote');
const request = require('supertest').agent(app.listen());
const cleanupHelpers = require('./cleanupHelpers');

describe('adding vote', () => {
	let testQuestion;
	let q;
	let testVote;

	beforeEach(done => {
		testQuestion = {
			title: 'being voted question',
			tags: ['tag1', 'tag2']
		};

		co(function* () {
			q = yield questions.insert(testQuestion);

			testVote = {
				tagString: q.tags.join(', '),
				questionId: q._id,
				voteValue: 4
			};

			done();
		});
	});

	afterEach(done => {
		Promise.all([cleanupHelpers.removeAllQuestions(), cleanupHelpers.removeAllVotes()]).then(() => {
			done();
		});
	});

	it('displays voting page', done => {
		co(function* () {
			request.get(`/vote?questionId=${q._id}`)
					.expect('Content-Type', /html/)
					.expect(res => {
						res.text.should.containEql(q.title)
					})
					.expect(200, done);
		});
	});

	it('returns error when no question can be found', done => {
		const invalidQuestionId = '000000000000000000000000';

		request.get(`/vote?questionId=${invalidQuestionId}`)
				.expect(302)
				.expect('location', '/')
				.expect('ErrorMessage', `No question found for id: '${invalidQuestionId}'`)
				.end(done);
	});

	it('returns error when no questionId is passed to the page', done => {
		request.get('/vote')
				.expect(302)
				.expect('location', '/')
				.expect('ErrorMessage', 'No questionId passed to the page')
				.end(done);
	});

	it('add vote and redirect to comment page', done => {
		request.post('/vote')
				.send(testVote)
				.expect('location', /^\/vote\/[0-9a-fA-F]{24}\/comment$/)
				.expect(302, done);
	});

	it('requires a question reference', done => {
		const testVoteWithoutQuestionId = Object.assign({}, testQuestion);
		delete testVoteWithoutQuestionId.questionId;

		request.post('/vote')
				.send(testVoteWithoutQuestionId)
				.expect('location', '/')
				.expect('ErrorMessage', 'QuestionId required')
				.expect(302, done);
	});
});