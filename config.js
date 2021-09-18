module.exports = {
	port: 3000,
	db: {
		prod: process.env.DATABASE_URL || '',
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