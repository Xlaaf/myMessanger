const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Инициализация сервера на базе express (app)
const server = require('http').createServer(app);

// Инициализация Socket IO сервера
const io = require('socket.io')(server);

// Объявление кастомного middleware для проверки JWT-токена
const { checkJwt } = require('./middlewares/middlewares');


app.use(express.json({ extended: true }))

// Express роуты
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/database/:jwtToken', checkJwt, require('./routes/db.routes'));
app.use('/api/chat/:jwtToken', checkJwt, require('./routes/chat.routes'));

// Socket IO: обработка подключения и дальнейшее взаимодействие
io.on('connection', require('./socket.handler'));

// Порт берется из конфига. В случае ошибки ставится в значение 5000
const PORT = config.get('port') || 5000;

// Главная функция: подключение к mongoDb (mongoose) и прослушивание порта
async function start() {
    try {

        // Подключение к MongoDB с помощью Mongoose
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        // Запуск сервера. Прослушивается порт #PORT. 
        server.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`));

    } catch (e) {
        
        console.log('Server error', e.message);
        process.exit(1);
    }
}

start();