'use strict';

const app = require('../app');
const should = require('should');
const co = require('co');
const questions = require('../model/Question');
const request = require('supertest').agent(app.listen());
const cleanupHelpers = require('./cleanupHelpers');

describe('udpating questions', () => {
	beforeEach(done => {
		cleanupHelpers.removeAllQuestions(done);
	});

	afterEach(done => {
		cleanupHelpers.removeAllQuestions(done);
	});

	it('displays a page for an existing question', done => {
		co(function* () {
			var q = yield questions.insert({
				title: 'A question?',
				tags: ['tag1', 'tag2']
			});

			request.get(`/question/${q._id}`)
					.expect('Content-Type', /html/)
					.expect(res => {
						res.text.should.containEql(q.title);
						res.text.should.containEql('tag1, tag2');
					})
					.expect(200, done);
		});
	});

	it('udpate an existing question', done => {
		co(function* () {
			var q = yield questions.insert({
				title: 'A question?',
				tags: ['tag1', 'tag2']
			});

			request.post(`/question/${q._id}`)
					.send({
						questionTitle: 'An updated question',
						tagString: 'tag3, tag4'
					})
					.expect('location', `/question/${q._id}`)
					.expect(302, done);
		});
	});
});