const User = require('../models/user');

const { Router } = require('express');
const router = Router();


router.get('/userInfo', async (req, res) => {
    try {
        const userId = req.body.jwtDecoded.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь с таким id не найден' });
        }

        res.json({ name: user.name, photo: user.photo });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.post('/userInfo', async (req, res) => {
    try {
        const userId = req.body.jwtDecoded.userId;
        const { name, photo } = req.body;

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { name, photo }
        );

        user.save();

        res.json({ message: 'Данные успешно обновлены' });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
})


module.exports = router;