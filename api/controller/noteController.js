const db = require('../models');

const createdNote = (req, res) => {
	const { text } = req.body;
	if (!text) return res.json({ msg: 'Enter note text' });

	db.Note.create({
		text: text,
		UserId: req.userId,
	})
		.then(() => {
			return res.json({ msg: 'Note created successfully' });
		})
		.catch(e => {
			console.log(e);
			return res.json({ msg: 'Что-то пошло не так' });
		});
};

const getNote = (req, res) => {
	console.log(req.query);
	db.Note.findAll({ include: db.User })
		.then(notes => {
			res.json({
				notes: notes.map(note => {
					return {
						...note.toJSON(),

						UserId: undefined,

						User: note.User
							? {
									id: note.User.id,
									login: note.User.login,
							  }
							: null,
					};
				}),
			});
		})
		.catch(e => {
			console.log(e);
			return res.json({ msg: 'Что-то пошло не так' });
		});
};

const updateNote = (req, res) => {
	const id = req.params.id;
	const { text } = req.body;
	if (!id) throw new Error('Выберете заметку, которую хотите изменить');
	if (!text) throw new Error('Введите текст');
	db.Note.findOne({ where: { id: id } })
		.then(note => {
			if (!note) throw new Error('Такой заметки не существует');
			if (note.UserId !== req.userId) throw new Error('Изменять можно только свои заметки');
		})
		.then(() => {
			db.Note.update({ text: text }, { where: { id: id } });
		})
		.then(() => {
			return res.json({ msg: 'Заметка успешно обновлена' });
		})
		.catch(e => {
			console.log(e);
			return res.json({ msg: e.message });
		});
};

module.exports = { createdNote, getNote, updateNote };
