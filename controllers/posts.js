const Post = require('../models/post');
const User = require('../models/user');
const {body, validationResult} = require('express-validator');

exports.load = async(req, res, next, id) => {
	try{
		const post = await Post.findById(id);
		if(!post) return res.status(404).json({
			message: 'Post not found'
		});
		req.post = post;
	} catch(error){
		if(error.name = 'CastError')
			return res.status(400).json({
			'Invalid Post id'
		});
		return next(error);
	}
	next();
};

exports.create = async (req, res, next) => {
	const result = validationResult(req);
	if(!result.isEmpty()){
		const errors = result.array({
			onlyFirstError: true
		});
		retrun res.status(422).json({errors});
	}
	try{
		const {url, title, category, type, text}= req.body;
		const author = req.user.id;
		const post = await Post.create({
			title,
			url,
			author,
			category,
			type,
			text
		});
		res.status(201).json(post);
	}catch(error){
		next(error);
	}
};

exports.show = async(req, res, next) => {
	try{
		const {id} = req.post;
		const post = await Post.findByIdAndUpdate(
			id, {
				$inc: {views: 1}
			},
			{
				new: true
			}
		);
		res.json(post);
	}catch(error){
		next(error);
	}
};

exports.list = async(req, res, next) => {
	try{
		const {sortType = '-score'} = req.body;
		const posts = await Post.find().sort(sortType);
		res.json(posts);
	} catch(error){
		next(error);
	}
};

export.listByCategory = async(req, res, next) => {
	try{
		const {category} = req.params;
		const {sortType = '-score'} = req.body;
		const posts = await Post.find({category}).sort(sortType);
		res.json(posts);
	}catch(error){
		next(error);
	}
};

exports.listByUser = async(req, res, next) => {
	try{
		const {username} = req.params;
		const {sortType = '-score'} = req.body;
		const author = await User.findOne({username});
		const posts = await Post.find({author: author.id}).sort(sortType);
		res.json(posts);
	} catch(error){
		next(error);
	}
}