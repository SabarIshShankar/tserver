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