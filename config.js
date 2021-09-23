module.exports = {
	port: 3000,
	db: {
		prod: process.env.DATABASE_URL || 'mongodb+srv://25CL:3cmIa17153P6Y1kd@cluster0.oaigs.mongodb.net/mong?retryWrites=true&w=majority',
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		}
	},
	jwt: {
		secret: process.env.JWT_SECRET || 'development_secret',
		expiry: '7d'
	}
};