const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);


const { checkJwt } = require('./middlewares/middlewares');


app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/database/:jwtToken', checkJwt, require('./routes/db.routes'));
app.use('/api/chat/:jwtToken', checkJwt, require('./routes/chat.routes'));

io.on('connection', require('./socket.handler'));


const PORT = config.get('port') || 5000;
async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        server.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`));

    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

start();