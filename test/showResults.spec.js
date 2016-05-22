'use strict';

const app = require('../app');
const should = require('should');
const co = require('co');
const questions = require('../model/Question');
const votes = require('../model/Vote');
const request = require('supertest').agent(app.listen());
const cleanupHelpers = require('./cleanupHelpers');

describe('showing results', () => {
	let filterPostData;

	beforeEach(done => {
		filterPostData = {

		};

		done();
	});

	afterEach(done => {
		Promise.all([cleanupHelpers.removeAllVotes(), cleanupHelpers.removeAllUsers(), cleanupHelpers.removeAllQuestions()]).then(() => {
			done();
		});
	});

	it('has a page to filter results from', done => {
		co(function* () {
			yield [
				questions.insert({title: 'Question 1?'}),
				questions.insert({title: 'Question 2?'}),
				questions.insert({title: 'Question 3?'})
			];

			request.get('/results')
					.expect(res => {
						res.text.should.containEql('Question 1?');
						res.text.should.containEql('Question 2?');
						res.text.should.containEql('Question 3?');
					})
					.expect(200, done);
		});
	});
	it('returns an excel file', done => {
		filterPostData.tagString = 'tag 1, tag 2';
		request.post('/results')
				.send(filterPostData)
				.expect('content-type', 'application/vnd.ms-excel')
				.expect('content-disposition', 'attachment;filename=results.xls')
				.expect(200, done);
	});
	it('filters the result by question');
	it('filters the result by from and to date');
	it('filters the result by tag');
	it('filters the result by several tags', done => {
		co(function* () {
			yield [
				votes.insert({
					value: 1,
					tags: ['tag 1'],
					questionId: 0
				}),
				votes.insert({
					value: 2,
					tags: ['tag 2'],
					questionId: 0
				}),
				votes.insert({
					value: 3,
					tags: ['tag 2', 'tag 1'],
					questionId: 0
				}),
				votes.insert({
					value: 4,
					tags: ['tag 3', 'tag 4'],
					questionId: 0
				}),
			];

			filterPostData.tagString = 'tag 1, tag 2';

			request.post('/results')
					.send(filterPostData)
					.expect(res => {
						res.text.should.containEql('<td>1</td>');
						res.text.should.containEql('<td>2</td>');
						res.text.should.containEql('<td>3</td>');
						res.text.should.not.containEql('<td>4</td>');
						res.text.should.not.containEql('<td>Q2</td>');
					})
					.expect(200, done);
		});
	});
});