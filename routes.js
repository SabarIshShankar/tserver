const users = require('./controllers/users');
const posts = require('./controllers/posts');
const votes = require('./controllers/votes');
const comments = require('./controllers/comments');
const requireAuth = require('./middlewares/requireAuth');
const postAuth = require('./middlewares/postAuth');
const commentAuth = require('./middlewares/commentAuth');

const router = require('express').Router();

router.post('/signup', user.validate, users.signup);
router.post('/authenticate', users.validate, users.authenticate);


router.param('post', posts.load);
router.post('/posts', [require, posts.validate], post.create);
router.get('/post/:post', posts.show);
router.get('/posts', post.list);
router.get('/posts/:category', posts.listByCategory);
router,get('/user/:username', posts.listByUser);
router.delete('/post/:post', [requireAuth, postAuth], posts.delete);

router.get('/post/:post/upvote', requireAith, votes.upvote);
router.get('/post/:post/downvote', requireAuth, votes.downvote);
router.get('/post/:post/unvote', requireAuth, votes.unvote);

router.param('comment', comments.load);
router.post('/post/:post', [requireAuth, comments.validate], 
comments.create);
router.delete(
	'/post/:post/:comment',
	[requireAuth, commentAuth],
	comments.delete
);

module.exports = (app) => {
	app.use('/api', router);
	app.use((req, res, next) => {
		const error = new Error('Not found');
		error.status = 404;
		next(error);
	});

	app.use((error, req, res, next) => {
		res.status(error.status || 500).json({
			message: error.message
		});
	});
};