'use strict';

const app = require('../app');
const co = require('co');
const request = require('supertest').agent(app.listen());

describe('homepage', () => {
	it('displays without errors', done => {
		request.get('/')
				.expect(200)
				.expect('Content-Type', /html/)
				.end(done);
	});
});