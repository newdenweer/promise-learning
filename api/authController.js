const db = require('../api/models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = id => {
	let secret = 'SECRET_KEY_12345';
	let data = {
		id,
	};
	return jwt.sign(data, secret, { expiresIn: 60 * 60 });
};

const registration = (req, res) => {
	try {
		const { login, password } = req.body;
		if (!login || !password) {
			return res.status(400).json({ msg: 'No login or password' });
		}
		let hashPassword = bcrypt.hashSync(password, 5);
		const result = db.User.create({
			login: login,
			password: hashPassword,
		});
		result
			.then(() => {
				return res.status(200).json({ msg: 'Registration completed successfully' });
			})
			.catch(() => {
				return res.status(400).json({ msg: `Username [${login}]  is taken` });
			});
	} catch (e) {
		console.log(e);
		return res.status(400).json({ msg: 'Registration error' });
	}
};

const login = (req, res) => {
	try {
		const { login, password } = req.body;
		if (!login || !password) {
			return res.status(400).json({ msg: 'No login or password' });
		}
		const userData = db.User.findOne({ where: { login: login } });
		userData.then(user => {
			if (!user) {
				return res.status(400).json({ msg: 'User is not found' });
			}
			console.log(user.dataValues.password);
			let comparisonPasswords = bcrypt.compareSync(password, user.dataValues.password);
			if (!comparisonPasswords) {
				return res.status(400).json({ msg: 'Invalid password' });
			}
			console.log(user.dataValues.id);
			let token = generateToken(user.dataValues.id);
			console.log({ token });
			return res.status(200).json({ token });
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({ msg: 'Login error' });
	}
};

module.exports = { login, registration };
