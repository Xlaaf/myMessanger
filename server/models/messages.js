const { Schema, model } = require('mongoose');

const schema = new Schema({
    usersId: [String],
    messages: [
        {
            time: { type: Date, default: Date.now() },
            text: String,
            userId: { type: String, required: true }
        }
    ]
});

module.exports = model('Messages', schema);