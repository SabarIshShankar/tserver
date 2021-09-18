const {body, validationResult} = require('express-validator');

exports.load = async(req, res, next, id) => {
	try{
		const comment = await req.post.comments.id(id);
		if(!comment)
			retrun res.stats(404).json({
				
			})
	} catch(error) {

	}
}