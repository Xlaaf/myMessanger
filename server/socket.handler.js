const User = require('./models/user');

module.exports = socket => {
    console.log('connection', socket.id);

    // Коллекция для хранения списка контактов
    // Коллекция нужна, чтобы знать кому отправлять рассылку об изменениях у пользователя
    socket.contacts = new Set();


    // Событие инициализации пользователя
    socket.on('initialUser', async data =>{
        socket.userId = data.userId;
        
        // Создать комнату по id пользователя
        socket.join(data.userId);

        // Изменить статус "онлайн" в БД в значению true
        await User.findOneAndUpdate(
            { _id: data.userId },
            { isOnline: true }
        );
    });

    // Событие на добавление нового контакта в коллекцию "контактов"
    socket.on('initContact', data => {
        // data.userId - id пользователя, чей контакт добавляем в "список контактов" нашего пользователя
        socket.to(data.userId).emit('update-status', {userId: socket.userId, isOnline: true});
        socket.contacts.add(data.userId); // добавление конакта в коллекцию
    });

    // Событие на отправку сообщения
    socket.on('message', data => {
        // data.userId - id пользователя которому нужно отправить сообщение
        socket.to(data.userId).emit('newMessage', data.message);
    });

    // Событие на дисконект
    socket.on('disconnect', async () => {

        // Вывод некоторых данных в консоль
        console.log('\ndiconnect', socket.id);
        console.log('disconnect userId: ', socket.userId);
        console.log('disconnect socket.contacts: ', socket.contacts);

        // Отправка рассылки пользователям из коллекции "контактов" о выходе пользователя из "онлайн"
        socket.contacts.forEach((userId) => {
            socket.to(userId).emit('update-status', {userId: socket.userId, isOnline: false})
        });

        // Изменение онлайн статуса в БД в значение false
        await User.findOneAndUpdate(
            { _id: socket.userId },
            { isOnline: false }
        );
    });
}