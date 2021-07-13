const User = require('../models/user');
const Messages = require('../models/messages');

const { Router } = require('express');
const router = Router();

// Получить информацию о пользователе (имя, фото, статус онлайн)
router.get('/userInfo', async (req, res) => {
    try {
        const userId = req.body.jwtDecoded.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'Pengguna dengan id ini tidak ditemukan' });
        }

        res.json({ name: user.name, photo: user.photo, isOnline: user.isOnline });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Изменить данные о пользователе (имя, фото)
router.post('/userInfo', async (req, res) => {
    try {
        const userId = req.body.jwtDecoded.userId;
        const { name, photo } = req.body;

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { name, photo }
        );

        user.save();

        res.json({ message: 'Data berhasil diperbarui' });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
})

// Получить пользователей, с которыми ведется переписки
router.get('/contacts', async (req, res) => {
    try {
        // Определение id пользователя и поиск в БД его переписок
        const userId = req.body.jwtDecoded.userId;
        const user = await User.findOne({ _id: userId }).populate('messages').lean();
        const messages = user.messages;

        // Создание массива объектов "Контакты" - информация с кем польователь ведет переписки
        const contacts = await Promise.all(messages.map(async (msg) => {
            // Определение id пользователя - собеседника и последнего сообщения с этим пользователем
            // (в массиве сообщениий хранится массив id обоих пользователей, поэтому нужно определить какой из id не "наш")
            const contactId = msg.usersId[0] === userId ? msg.usersId[1] : msg.usersId[0];
            const lastMessage = msg.messages[msg.messages.length - 1];

            // Поиск в БД информации о пользователе - собеседнике (картинка, статус онлайн, имя)
            const contact = await User.findOne({ _id: contactId }).select('photo isOnline name');

            return { contact, lastMessage };
        }));


        res.json({ contacts });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Получить всех пользовалей
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.body.jwtDecoded.userId } }, 'photo name isOnline');
        if (!users) {
            throw new Error('Kesalahan! Tidak dapat menemukan pengguna selain Anda!');
        }

        res.json({ users });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Открыть переписку с пользователем
router.get('/messages/:scndUserId', async (req, res) => {
    try {
        // firstUser - отправитель запроса, secondUser - с кем отправитель ведет переписку
        const firstUserId = req.body.jwtDecoded.userId;
        const secondUserId = req.params.scndUserId;

        // Массив пользователей между которыми ведется переиска (по нему ведется поиск в БД)
        const usersId = [firstUserId, secondUserId].sort();

        // Поиск по БД переписок, инфу о втором и первом пользователях
        const messages = await Messages.findOne({ usersId })
        const secondUser = await User.findOne({ _id: secondUserId }).select('photo name isOnline');
        const firstUser = await User.findOne({ _id: firstUserId }).select('photo name isOnline');

        // Если не получилось найти второго пользователя
        if (!secondUser) {
            throw new Error('Pengguna yang mengobrol dengan Anda tidak ditemukan!');
        }

        // Если не получилось найти первого пользователя
        if (!firstUser) {
            throw new Error('Pengguna tidak ditemukan!');
        }

        // Если не удалось переиски между данными пользователям
        if (!messages) {
            // Веернуть объект с инфой об обоих пользователях
            return res.json({ firstUser, secondUser });
        }

        // Вернуть объект о пользователях и их переписку
        res.json({
            firstUser, secondUser,
            messages: messages.messages.reverse(),
            roomId: messages._id
        });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Получить статус онлайн пользователя
router.get('/:userId/status', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error('Pengguna dengan id ini tidak ditemukan!');
        }

        res.json({ isOnline: user.isOnline });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
})

module.exports = router;
