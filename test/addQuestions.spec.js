'use strict';

const app = require('../app');
const should = require('should');
const co = require('co');
const questions = require('../model/Question');
const request = require('supertest').agent(app.listen());
const cleanupHelpers = require('./cleanupHelpers');

describe('adding questions', () => {
	let a_question_form;

	beforeEach(done => {
		a_question_form = {
			questionTitle: 'A question?',
			tagString: 'tag1, tag2, tag3'
		};

		cleanupHelpers.removeAllQuestions(done);
	});

	afterEach(done => {
		cleanupHelpers.removeAllQuestions(done);
	});

	it('displays a page for adding questions', done => {
		request.get('/question')
				.expect(200)
				.expect('Content-Type', /html/)
				.end(done);
	});

	it('stores correct formatted forms as a new question', done => {
		request.post('/question')
				.send(a_question_form)
				.expect(302)
				.expect('location', /^\/question\/[0-9a-fA-F]{24}$/)
				.end(done);
	});
});