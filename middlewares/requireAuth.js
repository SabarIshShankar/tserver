const jwtDecode = require('jwt-decode');
const requireAuth = (req, res, next) => {
	const token = req.headers.authorization;
	if(!token){
		return res.status(401).json({
			message: 'failed'
		});
	}
	const decodeToken = jwtDecode(token.slice(7));

	if(!decodedToken){
		return res.status(401).json({
			message: 'invalid'
		});
	} else {
		req.user = decodeToken;
		next();
	}
};

module.exports = requireAuth; 