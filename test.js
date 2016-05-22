'use strict';

const app = require('./app');
const co = require('co');
const users = require('./model/User');
const request = require('supertest').agent(app.listen());

describe('Simple User Http CRUD API', () => {
	let a_user;
	const removeAllUsers = done => {
		co(function* () {
			yield users.remove({});
		}).then(done);
	};

	beforeEach(done => {
		a_user = {
			name: 'Tony',
			age: 30,
			height: 1.91
		};

		removeAllUsers(done);
	});

	afterEach(done => {
		removeAllUsers(done);
	});

	it('add a new user', done => {
		request.post('/user')
				.send(a_user)
				.expect('location', /^\/user\/[0-9a-fA-F]{24}$/)
				.expect(201, done);
	});

	it('fails with validation error for users without name', (done) => {
		const userWithoutName = Object.assign({}, a_user);
		delete userWithoutName.name;

		request.post('/user')
				.send(userWithoutName)
				.expect('name required')
				.expect(400, done);
	});

	it('gets existing user by id', done => {
		co(function* () {
			const insertedUser = yield users.insert(a_user);
			const url = `/user/${insertedUser._id}`;

			request.get(url)
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(/Tony/)
					.expect(/30/)
					.expect(/1\.91/)
					.expect(200, done);
		});
	});

	it('updates an existing user', done => {
		co(function* () {
			const insertedUser = yield users.insert(a_user);
			const url = `/user/${insertedUser._id}`;

			request.put(url)
					.send({name: 'Tony Kung'})
					.expect('location', url)
					.expect(204, done);
		});
	});

	it('deletes an existing user', done => {
		co(function* () {
			const insertedUser = yield users.insert(a_user);
			const url = `/user/${insertedUser._id}`;

			request.del(url)
					.expect(200, done);
		});
	});
});