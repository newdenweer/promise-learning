const db = require('../api/models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = id => {
	let secret = process.env.JWT_SECRET;
	//console.log(secret);
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
			let comparisonPasswords = bcrypt.compareSync(password, user.password);
			if (!comparisonPasswords) {
				return res.status(400).json({ msg: 'Invalid password' });
			}
			let token = generateToken(user.id);
			return res.status(200).json({ token });
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({ msg: 'Login error' });
	}
};

const getUsers = (req, res) => {
	try {
		const usersPromise = db.User.findAll();
		usersPromise
			.then(users => {
				if (!users) {
					return res.status(400).json({ msg: 'GetUser error' });
				}
				//console.log(users.map(u => u.toJSON()));
				return res.status(200).json(users);
			})
			.catch(err => {
				console.log(err.message);
			});
	} catch (e) {
		console.log(e);
		return res.status(400).json({ msg: 'GetUser error' });
	}
};

module.exports = { login, registration, getUsers };
