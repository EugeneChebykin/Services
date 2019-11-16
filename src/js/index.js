import '../scss/style.scss';
import Swiper from 'swiper';
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
        pagination: {
            el: '.swiper-pagination'
        }
    };


    if(window.innerWidth <= 1120) {
        let servicesNavSlider = new Swiper(servicesNav, sliderConf);
    }

    if(window.innerWidth <= 768) {
        let brandsNavSlider = new Swiper(brandsNav, sliderConf);
        let devicesNavSlider = new Swiper(devicesNav, sliderConf);
        let tableRowsSlider = new Swiper(tableRows, sliderConf);
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
    let content = Array.from(document.querySelector('.toggle-show')),
        buttons = document.querySelectorAll('.read-more');

    let currentState = 'short';

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log(this);
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

    update() {
        this.modals = Array.from(document.querySelectorAll(`.${this.modalsClassName}`));
    }

    closeAll() {
        let allModals = document.querySelectorAll('.modal');
        allModals.forEach(modal => modal.classList.remove(`${this.modalsClassName}--active`));
        this.overlay.classList.remove('overlay--active');
        this.update();
    }

    open(className) {
        this.closeAll();
        let [ currentModal ] = this.modals.filter(modal => modal.classList.contains(className));
        this.overlay.addEventListener('click', () => this.closeAll());
        currentModal.classList.add(`${this.modalsClassName}--active`);
        this.overlay.classList.add('overlay--active');
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