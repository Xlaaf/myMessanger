export default function setBlockHeight(block) {
    const contactsElem = document.querySelector('.contacts');
    const contactsDisplayStyle = window.getComputedStyle(contactsElem).display;
    if (contactsDisplayStyle === 'none') {
        const displayHeight = window.innerHeight;
        const navbarHeight = document.querySelector('.navbar').getBoundingClientRect().height;
        block.style.height = displayHeight - navbarHeight + 'px';
    }
}