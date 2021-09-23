const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require("../config");
const createToken = (user) => {
	if(!user.role){
		throw new Error("No user role specified");
	}
	return jwt.sign({
		id: user._id,
		username: user.username,
		role: user.role,
		iss: "api.app",
		aud: "api.app",
	},
	config.jwt.secret,{
		algorithm: "HS256",
		expiresIn: config.jwt.expiry
	});
};


const hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(12, (err, salt) => {
			if(err){
				reject(err);
			}
			bcrypt.hash(password, salt, (err, hash) => {
				if(err){
					reject(err);
				}
				resolve(hash);
			});
		});
	});
};

const verifyPassword = (paswordAttempt, hashedPassword) => {
	return bcrypt.compare(passwordAttempt, hashedPassword);
};

module.exports = {
	createToken, hashPassword, verifyPassword,
};