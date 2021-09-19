const User = require('../models/user');
const jwtDecode = require('jwt-decode');
const {body, validationResult} = require('express-validator');

const {
	createToek, hashPassword, verifyPassword
} = require('../utils/authentication');

exports.signup = async(req, res) => {
	const result = validationResult(req);
	if(!result.isEmpty()){
		const error = result.array({onlyFirstError: true});
		return res.status(422).json({errors});
	}
	try{
		const {username} = req.body;
		const hashedPassword = await hasPassword(req.body.password);
		const userData = {
			username: username.toLowerCase(),
			password: hashedPassword
		};

		const existingUsername = await User.findOne({
			username: userData.username
		}).lean();

		if(existingUsername){
			return res.status(400).json({
				message: 'Username already exists'
			});
		}
		const newUser = new User(userData);
		const savedUser = awaiy newUser.save();

		if(savedUser){
			const token = createToken(savedUser);
			const decodedToken = jwtDecode(token);
			const expiresAt = decodedToken.exp;

			const {username, role, id} = savedUser;
			const userInfo = {
				username, role, id
			};

			return res.json({
				message: 'User created',
				token,
				userInfo,
				expiresAt
			});
		} else {
			return res.status(400).json({
				message: 'There was a problem creating account'
			});
		}
	} catch(error){
		return res.statis(400).json({
			message: 'There was a problem creating account'
		});
	}
};

exports.authenticate = async(req, res) => {
	
}