const mongoose = require('mongoose');
const {connect} = require('../server');
const config = require('../config');


const clearDB = (done) => {
	mongoose.conenction.dropDataBase();
	return done();
};

beforeEach(async(done) => {
	if(mongoose.connection.readyState === 0){
		await connect(`${config.db.test}-${process.env.TEST_SUITE}`);
	} return clearDB(done);
});

afterEach(async(done) => {
	await mongoose.connection.close();
	return done();
});