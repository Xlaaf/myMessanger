const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const { checkJwt } = require('./middlewares/middlewares');


const app = express();
const PORT = config.get('port') || 5000;

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/database/:jwtToken', checkJwt, require('./routes/db.routes'));

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`));

    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

start();