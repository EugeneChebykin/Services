import '../scss/style.scss';
import Swiper from 'swiper/js/swiper.js';
import 'babel-polyfill';

console.log('Works!');

window.onload = function() {
    bindSliders();
    //InitializeNavbarModal();
    toggleShowMore();
    toggleSearchInput();
    submitHandler();

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
        //InitializeNavbarModal();
    }
}

function submitHandler(e) {
    let forms = Array.from(document.querySelectorAll('.form'));
    forms.forEach(form => {
        form.addEventListener('submit', (e) => e.preventDefault());
    });
}

function preventWindowScroll(type) {
    if(window.innerWidth <= 768) {
        if(type == true) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'visible';
        }
    } 
}

// function InitializeNavbarModal() {
//     let navbar = document.querySelector('.navbar');
//         if(window.innerWidth <= 1120) {
//             navbar.classList.add('modal-navbar');
//         } else {
//             navbar.classList.remove('modal-navbar');
//         }
// }

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

    if(window.innerWidth < 768) {
        let brandsNavSlider = new Swiper(brandsNav, Object.assign({}, sliderConf, {
            pagination: {
                el: '.brands__pagination'
            }
        }));
        let devicesNavSlider = new Swiper(devicesNav, Object.assign({}, sliderConf, {
            pagination: {
                el: '.devices__pagination'
            }
        }));
        let tableRowsSlider = new Swiper(tableRows, Object.assign({}, sliderConf, {
            pagination: {
                el: '.prices__pagination'
            }
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
    const textHeight = 98;
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
            if(elem.classList.contains('services__hide')) {
                btn.children[1].innerHTML= "Читать далее";
                elem.style.height = `${textHeight}px`;
            } else {
                btn.children[1].innerHTML= `Показать всё(${countChildren(elem)})`;
                elem.style.height = `${baseHeight + 10}px`;
            }
            btn.children[0].src = 'img/arrow-down.png';
            
            currentState = 'short';
        }
    }

    function countChildren(elem) {
        let list = elem.querySelector('.list');
        let count = 0;

        Array.from(list.children).forEach(child => {
            if(child.tagName == 'DIV') {
                count++;
            }
        });

        return count;
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

        //Проходимся циклом по всем модалкам
        allModals.forEach(modal => {
            let classList = Array.from(modal.classList);
            //Проходимся циклом по всем классам каждой модалки
            classList.forEach(className => {
                //Проверяем, содержит ли имя класса модификатор active
                if(className.indexOf('--active') != -1) {
                    //Если да, удаляем этот класс у модалки
                    modal.classList.remove(className);
                }
            });
        });
        this.overlay.classList.remove('overlay--active');

        //preventWindowScroll();

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

        //preventWindowScroll(true);
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