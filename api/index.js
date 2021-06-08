const express = require('express');
const authRouter = require('./router/authRouter');
const noteRouter = require('./router/noteRouter');
const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use('/note', noteRouter);

app.get('/', (req, res) => {
	res.status(200).json('Server is working');
});

app.use((req, res, next) => {
	next(new Error('Not found'));
});

app.use((err, req, res, next) => {
	res.status(err.status || 404);
	res.json({ msg: err.message });
});

app.listen(3000, () => {
	console.log('Server started at 3000');
});
