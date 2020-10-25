const User = require('./models/user');

module.exports = socket => {
    console.log('connection', socket.id);


    socket.on('join', async data => {
        socket.userId = data.userId;
        socket.roomId = data.roomId;
        socket.join(data.roomId);

        socket.to(data.roomId).emit('userStatus', {userId: data.userId, isOnline: true});

        await User.findOneAndUpdate(
            { _id: data.userId },
            { isOnline: true }
        );
    });

    socket.on('message', data => {
        if (!socket.roomId) return;
        socket.to(socket.roomId).emit('newMessage', data);
    });


    socket.on('disconnect', async () => {
        console.log('diconnect', socket.id);

        socket.to(socket.roomId).emit('userStatus', false);

        await User.findOneAndUpdate(
            { _id: socket.userId },
            { isOnline: false }
        );
    });
}