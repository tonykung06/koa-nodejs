'use strict';

const app = require('../app');
const should = require('should');
const co = require('co');
const questions = require('../model/Question');
const votes = require('../model/Vote');
const request = require('supertest').agent(app.listen());
const cleanupHelpers = require('./cleanupHelpers');

describe('adding comment', () => {
	let testVote;

	beforeEach(done => {
		testVote = {
			tagString: ['tag1', 'tag2', 'tag3'],
			questionId: 0,
			voteValue: 3
		};

		done();
	});

	afterEach(done => {
		cleanupHelpers.removeAllVotes(done);
	});

	it('displays comment page', done => {
		co(function* () {
			const voteRecord = yield votes.insert(testVote);

			request.get(`/vote/${voteRecord._id}/comment`)
					.expect('Content-Type', /html/)
					.expect(200, done);
		});
	});

	it('adds a comment to an existing vote', done => {
		co(function* () {
			const voteRecord = yield votes.insert(testVote);

			request.post(`/vote/${voteRecord._id}/comment`)
					.send({
						comment: 'A nice comment'
					})
					.expect('location', `/vote?questionId=${voteRecord.questionId}`)
					.expect(302, done);
		});
	});
});