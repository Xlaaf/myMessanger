const Messages = require('../models/messages');
const User = require('../models/user');
const router = require('express').Router();

router.post('/sendmessage', async (req, res) => {
    try {
        // Данные с клиента (текс сообщения, id пользователей)
        const secondUserId = req.body.secondUserId;
        const userId = req.body.jwtDecoded.userId;
        const msgText = req.body.message;

        // Создание массива пользователей и объекта "сообщение"
        const usersId = [secondUserId, userId].sort();
        const messageItem = {
            time: Date.now(), // время сообщенияи
            text: msgText, // текст сообщения
            userId // пользователь - автор сообщения
        }

        // Поиск в БД переписки между этими пользователями и добавление нового сообщения
        const messages = await Messages.findOneAndUpdate(
            { usersId },
            { $push: { messages: messageItem } }
        );

        // Если такой переписки еще нет, нужно ее создать
        if (!messages) {

            // Создание объекта переписки (состоит из: массив пользователей, объект сообщений)
            const newMessages = new Messages({
                usersId, messages: [messageItem]
            });

            // Сохранение новой переписки в БД
            const msg = await newMessages.save();

            // Добавление в сущность первого пользователя новой переписки
            await User.findOneAndUpdate(
                { _id: secondUserId },
                { $push: { messages: msg._id } }
            )

            // Добавление в сущность второго пользователя новой переписки
            await User.findOneAndUpdate(
                { _id: userId },
                { $push: { messages: msg._id } }
            )
        }

        res.json({ message: 'Pesan berhasil dikirim', newMessage: {messageItem, _id: Math.random()} });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});



module.exports = router;
