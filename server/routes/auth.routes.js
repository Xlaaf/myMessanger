const { Router } = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/user');


const router = Router();

router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }),
        check('name', 'Не корректные данные в поле "Имя"').isLength({ min: 2, max: 50 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные регистрационные данные"
                });
            }

            const { email, password, name } = req.body;

            const candidate = await User.findOne({ email });
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким email адресом уже существует' });
            }

            const hashedPasswrod = await bcrypt.hash(password, 12);
            const user = new User({
                email, name, password: hashedPasswrod
            });

            await user.save();

            res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так. Попробуйте снова' })
        }
    }
)

router.post(
    '/login',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при входе в систему"
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Пользователь с таким email адресом не существует' });
            }

            const isMatch = bcrypt.compare(user.password, password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Беды с паролем' });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '7 days' }
            );

            res.json({ token, userId: user.id });

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так. Попробуйте снова' })
        }
    }
)

module.exports = router;