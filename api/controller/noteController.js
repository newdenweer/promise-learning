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
			//console.log(notes.map(n => n.toJSON()));
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
	const { id, text } = req.body;
	if (!id) return res.json({ msg: 'Выберете заметку, которую хотите изменить' });
	if (!text) return res.json({ msg: 'Введите текст' });
	db.Note.findAll({ where: { UserId: req.userId } })
		.then(notes => {
			let temp = false;
			notes.map(note => {
				if (note.dataValues.id === Number(id)) {
					temp = true;
				}
			});
			if (!temp) return res.json({ msg: 'Изменять можно только свои заметки' });
		})
		.then(() => {
			db.Note.update({ text: text }, { where: { id: id } });
		})
		.then(() => {
			return res.json({ msg: 'Заметка успешно обновлена' });
		})
		.catch(e => {
			console.log(e);
			return res.json({ msg: 'Что-то пошло не так' });
		});
};

module.exports = { createdNote, getNote, updateNote };
