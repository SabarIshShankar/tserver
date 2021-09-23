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
		const savedUser = await newUser.save();

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
	const result = validationResult(req);
	if(!result.isEmpty()){
		const error = result.array({
			onlyFirstError: true
		});
		return res.status(422).json({errors});
	} 
	try {
		const {username, password} = req.body;
		const user = await User.findOne({
			username: username.toLowerCase()
		});
		if(!user){
			return res.status(403).json({
				message: 'Wrong username or password'
			});
		}

		const passwordValid = await verifyPassword(password, user.password);

		if(passwordValid){
			const token = createToken(user);
			const decodedToken = jwtDecode(token);
			const expiresAt = decodedToken.exp;
			const {username, role, id} = user;
			const userInfo = {
				username, role, id
			};

			res.json({
				message: 'Auth successful',
				token, 
				userInfo,
				expiresAt
			});
		} else {
			res.status(403).json({
				message: 'Wrong username or password'
			});
		}
	} catch (error){
		return res.status(400).json({
			message: 'try again'
		});
	}
};


exports.validate = [
	body('username')
		.exists()
		.trim()
		.withMessage('is required')
		.notEmpty()
		.withMessage('cannot be blank')
		.isLength({max: 32})
		.withMessage('must be at most 32 long')
		.matches(/^[a-zA-Z0-9_-]^/)
		.withMessage('Contains invalid characters'),
	body('password')
		.exists()
		.trim()
		.withMessage('is required')

		.notEmpty()
		.withMessage('cannot be blank')
		.isLength({min: 6})
		.withMessage('must be at least 6 characters long')
		.isLength({max: 50})
		.withMessage('must be at most 50')
];