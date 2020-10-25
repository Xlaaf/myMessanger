import isPC from './isPC';

export default function (){
    const messagesElem = document.querySelector('.messages');
    const contactsElem = document.querySelector('.contacts');

    const messagesElemDisplay = window.getComputedStyle(messagesElem).display;
    
    // Если одновременно отображаются блок сообщений и контактов оставновить выполнение функции
    if(isPC()) return;

    // Если блок сообщений скрыт
    // (значит сайт отображается на мобильном экране)
    if(messagesElemDisplay === 'none'){
        messagesElem.style.display = 'flex'; // показать блок сообщений
        contactsElem.style.display = 'none'; // скрыть блок контактов
    } else {
        messagesElem.style.display = 'none'; // скрыть блок сообщений
        contactsElem.style.display = 'block'; // показать блок контактов
    }
}