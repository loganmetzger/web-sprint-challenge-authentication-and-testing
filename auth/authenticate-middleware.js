const jwt = require('jsonwebtoken');
const secrets = require('./secrets')

module.exports = (req, res, next) => {
  const token = req.headers.authorization
	if (token) {
    console.log(token)
		const secret = secrets.jwtSecret;
		jwt.verify(token, secret, function(err, decodedToken) {
			if (err) {
				res.status(401).json({ message: 'token invalid' });
			} else {
				req.token = decodedToken;
				next();
			}
		});
	} else {
		res.status(401).json({ message: 'login first' });
	}
};