document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu__btn');
    const menuClose = document.querySelector('.menu__close');
    const menuList = document.querySelector('.menu__list');
    const menuShadow = document.querySelector('.menu--close');
    function modalWindow(btn, close, list, curtain) {
        btn.addEventListener('click', () => {
            list.classList.toggle('menu__list--open');
            curtain.classList.toggle('menu--open');
        });
        close.addEventListener('click', () => {
            list.classList.remove('menu__list--open');
            curtain.classList.remove('menu--open');
        });
        curtain.addEventListener('click', () => {
            list.classList.remove('menu__list--open');
            curtain.classList.remove('menu--open');
        })
    }
    modalWindow(menuBtn, menuClose, menuList, menuShadow);
});