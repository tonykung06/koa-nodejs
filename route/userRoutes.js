const route = require('koa-route');
const parse = require('co-body');
const users = require('../model/User');

function* updateUser(id) {
	const userFromRequest = yield parse(this);

	yield users.updateById(id, userFromRequest);

	this.set('location', `/user/${id}`);
	this.status = 204;
}

function* deleteUser(id) {
	yield users.remove({_id: id});

	this.status = 200;
}

function* saveUser() {
	const userFromRequest = yield parse(this);

	if (!userFromRequest.name) {
		this.throw(400, 'name required');
	}

	try {
		const user = yield users.insert(userFromRequest);
	} catch (e) {
		this.body = 'An error occurred: ' + e;
		this.status = 401;
		return;
	}

	this.body = user;
	this.set('Location', `/user/${user._id}`);
	this.status = 201;
}

function* getUser(id) {
	const user = yield users.findById(id);

	this.body = user;
	this.status = 200;
}

module.exports = app => {
	app.use(route.post('/user', saveUser));
	app.use(route.get('/user/:id', getUser));
	app.use(route.put('/user/:id', updateUser));
	app.use(route.del('/user/:id', deleteUser));

	return app;
};