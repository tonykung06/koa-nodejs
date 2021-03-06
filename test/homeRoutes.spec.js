'use strict';

const app = require('../app');
const should = require('should');
const co = require('co');
const questions = require('../model/Question');
const request = require('supertest').agent(app.listen());
const cleanupHelpers = require('./cleanupHelpers');

describe('homepage', () => {
	beforeEach(done => {
		cleanupHelpers.removeAllQuestions(done);
	});

	afterEach(done => {
		cleanupHelpers.removeAllQuestions(done);
	});

	it('displays without errors', done => {
		request.get('/')
				.expect(200)
				.expect('Content-Type', /html/)
				.end(done);
	});

	it('list all the questions in the db', done => {
		co(function* () {
			yield questions.insert({
				title: 'Question Q1'
			});
			yield questions.insert({
				title: 'Question Q2'
			});

			request.get('/')
					.expect(200)
					.expect(function(res) {
						res.text.should.containEql('Question Q1');
						res.text.should.containEql('Question Q2');
					}).end(done);
		});
	});
});