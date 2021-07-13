const { Router } = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/user');

const router = Router();

// Регистрация пользователя
router.post(
    '/register',
    // Middleware для валидации данных, пришедших от html-формы
    [
        check('email', 'Email Salah').isEmail(), // Проверка e-mail на корректность
        check('password', 'Panjang kata sandi minimal 6 karakter').isLength({ min: 6 }), // Проверка пароля на корректность
        check('name', 'Data tidak valid di "Nama"').isLength({ min: 2, max: 50 }) // Проверка имени на корректность
    ],
    async (req, res) => {
        try {
            // Присвоение переменной errors ошибок, возникших в процессе валидации (выше в коде)
            const errors = validationResult(req);

            // Если erorrs не пуст (содержит ошибки), вернуть ошибку 400 и json с сообщением об ошибке
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Data pendaftaran salah"
                });
            }

            // Извлечение данных из тела запроса
            const { email, password, name } = req.body;

            // Проверка на наличие пользователя с указанной почтой в БД
            // Если пользователь найден, вернуть сообщение об ошибке (регистрация не состоялась)
            const candidate = await User.findOne({ email });
            if (candidate) {
                return res.status(400).json({ message: 'Pengguna dengan alamat email ini sudah ada' });
            }

            // Если польозватель с указанной почтой не найден, идем дальше.

            // Хеширование пароля (используется библиотека bcryptjs)
            const hashedPasswrod = await bcrypt.hash(password, 12);

            // Создание нового пользователя (MongoDB объекта)
            const user = new User({
                email, name, password: hashedPasswrod
            });

            // Сохранение нового пользователя в БД
            await user.save();

            // Вернуть сообщение об успешной регестрации
            res.status(201).json({ message: 'Pengguna berhasil terdaftar' });

        } catch (e) {

            // Вернуть сообщение об ошибке в процессе регестрации
            res.status(500).json({ message: 'Ada yang salah. Cobalah lagi' })
        }
    }
)

// Вход в учетную запись
router.post(
    '/login',
    // Middlewarre для валидации данных из html-формы
    [
        check('email', 'Email Salah').isEmail(),
        check('password', 'Panjang kata sandi minimal 6 karakter').exists()
    ],
    async (req, res) => {
        try {
            // Получение массива с ошибками валидации, если такие есть
            const errors = validationResult(req);

            // Если ошибки есть, вернуть сообщение о некорректности данных входа
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Data masuk salah"
                });
            }

            // Получение почты и пароля из тела запроса
            const { email, password } = req.body;

            // Поиск пользователя в БД с указанной почтой. 
            // Если пользователь с такой почтой не найден, вернуть сообщение об ошибке
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Pengguna dengan alamat email ini tidak ada' });
            }

            // Сравнение указанного пароля с паролем полученным из БД
            // Используется библиотека bcryptjs
            const isMatch = bcrypt.compare(user.password, password);

            // Если пароли не совпадают, вернуть сообщение об ошибке
            if (!isMatch) {
                return res.status(400).json({ message: 'Беды с паролем' });
            }

            // Если все хорошо, заводим JWT-токен на 7 дней
            const token = jwt.sign(
                { userId: user.id }, // Сохраняем в JWT userId пользователя
                config.get('jwtSecret'), // Секретная строка по которой происходит шифрование (берется из конфига)
                { expiresIn: '1 d' } // Время действия JWT - токена
            );

            // Вернуть json с JWT - токеном и userId
            res.json({ token, userId: user.id });

        } catch (e) {

            // Вернуть сообщение об ошибке
            res.status(500).json({ message: 'Ada yang salah. Coba lagi' })
        }
    }
);

module.exports = router;
