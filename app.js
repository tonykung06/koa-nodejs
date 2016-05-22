const koa = require('koa');
const app = koa();

const route = require('koa-route');
const parse = require('co-body');
const monk = require('monk');
const wrap = require('co-monk');
const db = monk('localhost/koa_users');
const users = wrap(db.get('users'));

app.use(route.post('/user', saveUser));
app.use(route.get('/user/:id', getUser));

function* saveUser() {
	const userFromRequest = yield parse(this);
	const user = yield users.insert(userFromRequest);

	this.body = user;
	this.set('Location', `/user/${user._id}`);
	this.status = 201;
}

function* getUser(id) {
	const user = yield users.findById(id);

	this.body = user;
	this.status = 200;
}

// app.use(function* () {
// 	this.body = 'Hello World!';
// });

app.listen(3000);
console.log('The app is listening at port 3000');