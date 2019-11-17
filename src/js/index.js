import '../scss/style.scss';
import Swiper from 'swiper/js/swiper.js';
import 'babel-polyfill';

console.log('Works!');

window.onload = function() {
    bindSliders();
    InitializeNavbarModal();
    toggleShowMore();
    toggleSearchInput();

    let modalMenu = new Modals({
        modals: '.modal-navbar',
        buttonsOpen: '.top-menu__burger-button',
        buttonsClose: '.modal-navbar-close',
        overlay: '.overlay'
    });

    let callBackModals = new Modals({
        modals: '.modal-right-group',
        buttonsOpen: '.modal-form-open',
        buttonsClose: '.form__close',
        overlay: '.overlay'
    });
    window.onresize = function() {
        InitializeNavbarModal();
    }
}

function preventWindowScroll(type) {
    if(window.innerWidth <= 768) {
        if(type == true) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }
    } 
}

function InitializeNavbarModal() {
    let navbar = document.querySelector('.navbar');
        if(window.innerWidth <= 1120) {
            navbar.classList.add('modal-navbar');
        } else {
            navbar.classList.remove('modal-navbar');
        }
}

function bindSliders() {
    let servicesNav = '.services__slider',
        brandsNav = '.brands__slider',
        devicesNav = '.devices__slider',
        tableRows = '.table--slider';

    let sliderConf = {
        slidesPerView: 'auto',
        direction: 'horizontal',
    };


    if(window.innerWidth <= 1120) {
        let servicesNavSlider = new Swiper(servicesNav, sliderConf);
    }

    if(window.innerWidth <= 768) {
        let brandsNavSlider = new Swiper(brandsNav, Object.assign({}, sliderConf, {
            pagination: {
                el: '.brands__pagination'
            },
            slidesOffsetAfter: 300
        }));
        let devicesNavSlider = new Swiper(devicesNav, Object.assign({}, sliderConf, {
            pagination: {
                el: '.devices__pagination'
            },
            slidesOffsetAfter: 100
        }));
        let tableRowsSlider = new Swiper(tableRows, Object.assign({}, sliderConf, {
            pagination: {
                el: '.prices__pagination'
            },
            slidesOffsetAfter: -130
        }));
    }
}

function toggleSearchInput() {
    let button = document.querySelector('.navbar__search-button'),
        searchInput = document.querySelector('.navbar__text');

    button.addEventListener('click', function(e) {
        e.preventDefault();
        if(searchInput.classList.contains('navbar__text--active')) {
            searchInput.classList.remove('navbar__text--active');
        } else {
            searchInput.classList.add('navbar__text--active');
        }
    })
}

function toggleShowMore() {
    const baseHeight = 170;
    let buttons = Array.from(document.querySelectorAll('.read-more'));

    let currentState = 'short';

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            let className = this.getAttribute('data-toggle');
            let currentElem = document.querySelector(`.${className}`);
            toggle(currentState, currentElem, this);
        });
    });
    

    function toggle(type, elem, btn) {
        if(type === "short") {
            elem.style.height = 'auto';
            btn.children[0].src = 'img/arrow-up.png';
            btn.children[1].innerHTML= "Скрыть";
            currentState = 'full'
        } 
        if(type === "full") {
            elem.style.height = `${baseHeight}px`;
            btn.children[0].src = 'img/arrow-down.png';
            btn.children[1].innerHTML= "Показать всё";
            currentState = 'short';
        }
    }
}

class Modals {
    constructor(settings) {
        this.modals = Array.from(document.querySelectorAll(settings.modals));
        this.buttonsOpen = Array.from(document.querySelectorAll(settings.buttonsOpen));
        this.buttonsClose = Array.from(document.querySelectorAll(settings.buttonsClose));
        this.overlay = document.querySelector(settings.overlay);
        this.modalsClassName = settings.modals.slice(1); //Обрезание точки в имени класса 
        this.init();
    }

    // update() {
    //     this.modals = Array.from(document.querySelectorAll(`.${this.modalsClassName}`));
    // }

    closeAll() {
        let allModals = Array.from(document.querySelectorAll('.modal'));

        //allModals.forEach(modal => modal.classList.remove(`${this.modalsClassName}--active`));
        //allModals.forEach(modal => modal.classList.remove('modal--active'));

        //Проходимся циклом по всем модалкам
        allModals.forEach(modal => {
            //Проходимся циклом по всем классам каждой модалки
            modal.classList.forEach(className => {
                //Проверяем, содержит ли имя класса модификатор active
                if(className.indexOf('--active') != -1) {
                    //Если да, удаляем этот класс у модалки
                    modal.classList.remove(className);
                }
            })
        })
        this.overlay.classList.remove('overlay--active');

        preventWindowScroll();

        //Эта функция обновляет список модалок. Так как модалка бокового меню инициализируется
        //только если ширина экрана < 1120px, могут возникнуть проблемы и, если 
        //изначально открыть страницу в большем разрешении и затем уменьшить его, то модалка
        //не будет работать, так как класс Modals инициализируется при window.onload
        //this.update();
    }

    open(className) {
        this.closeAll();

        let [ currentModal ] = this.modals.filter(modal => modal.classList.contains(className));

        this.overlay.addEventListener('click', () => this.closeAll());
        currentModal.classList.add(`${this.modalsClassName}--active`);
        currentModal.classList.add('modal--active');
        this.overlay.classList.add('overlay--active');

        preventWindowScroll(true);
    }

    bindOpen() {
        this.buttonsOpen.forEach(button => {
            button.addEventListener('click', () => {
                let window = button.getAttribute('data-open');
                this.open(window);
            });
        });
    }
    bindClose() {
        this.buttonsClose.forEach(button => {
            button.addEventListener('click', () => this.closeAll());
        });
    }

    init() {
        this.bindOpen();
        this.bindClose();
    }
}