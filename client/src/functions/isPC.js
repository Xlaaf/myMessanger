export default function isPC(){
    const messagesElem = document.querySelector('.messages');
    const contactsElem = document.querySelector('.contacts');

    const messagesElemDisplay = window.getComputedStyle(messagesElem).display;
    const contactsElemDisplay = window.getComputedStyle(contactsElem).display;
    
    // Если одновременно отображаются блок сообщений и контактов оставновить выполнение функции
    return messagesElemDisplay === 'flex' && contactsElemDisplay === 'block';
}