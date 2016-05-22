const co = require('co');
const questions = require('../model/Question');
const users = require('../model/User');
const votes = require('../model/Vote');

exports.removeAllQuestions = done => {
	return co(function* () {
		yield questions.remove({});
	}).then(done || () => {});
};

exports.removeAllUsers = done => {
	return co(function* () {
		yield users.remove({});
	}).then(done || () => {});
};

exports.removeAllVotes = done => {
	return co(function* () {
		yield votes.remove({});
	}).then(done || () => {});
};
