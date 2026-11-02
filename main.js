document.addEventListener('DOMContentLoaded', () => {

    // 1. БАЗА ДАННЫХ ДЛЯ ПЕРЕВОДА НА АНГЛИЙСКИЙ И РУССКИЙ
    const translations = {
        en: {
            nav_winter: "WINTER",
            nav_discover: "DISCOVER",
            nav_mountain: "THE MOUNTAIN",
            nav_realestate: "REAL ESTATE",
            nav_summer: "SUMMER",
            nav_events: "EVENTS",
            btn_safety: "SAFETY & RISK AWARENESS",
            btn_book: "BOOK NOW",
            weather_base: "BASE",
            weather_summit: "SUMMIT",
            weather_snow: "24HR SNOW",
            ski_conditions_title: "REVELSTOKE MOUNTAIN SKI CONDITIONS",
            btn_weather: "❄️ WEATHER REPORT",
            btn_hill_status: "🏔️ HILL STATUS",
            btn_webcams: "📷 HILL WEBCAMS",
            btn_save_winter: "% SAVE BIG ON WINTER",
            happening_title: "HAPPENING NOW",
            card1_title: "SAVE BIG ON WINTER BEFORE NOV 15",
            card1_desc: "Our Early Booking Offer is on sale now! Book your Revelstoke vacation by Nov 15 and save up to 40%.",
            learn_more: "LEARN MORE",
            card2_title: "EVENTS",
            card2_desc: "Revelstoke Mountain Resort offers a year-round lineup of events to elevate your mountain experience.",
            view_events: "VIEW EVENTS",
            card3_title: "SUMMER ACTIVITIES",
            card3_desc: "Revelstoke warms up for summer, becoming an adventure playground for outdoor activities.",
            explore: "EXPLORE",
            feat1_title: "ADVENTURE LIVES HERE",
            feat1_desc: "Revelstoke is a true adventure playground during the summer months. Experience the best of the outdoors with mountain biking, hiking, sightseeing, the Pipe Mountain Coaster, and more.",
            btn_summer_act: "SUMMER ACTIVITIES",
            feat2_title: "PIPE MOUNTAIN COASTER",
            feat2_desc: "Turn up the heat this summer and take a ride on Revelstoke's #1 summer attraction! Our two Mountain Coaster Tracks will take you for an exhilarating ride.",
            toll_free: "TOLL FREE",
            international: "INTERNATIONAL",
            more_info: "MORE INFO",
            link_contact: "Contact Us",
            link_feedback: "Feedback",
            link_press: "Press & Media",
            link_policy: "Harassment Policy",
            btn_account: "MY ACCOUNT",
            stay_connected: "STAY CONNECTED",
            subscribe_desc: "Sign up for exclusive offers, news and updates, events, and more.",
            btn_signup: "SIGNUP",
            privacy: "Privacy & Terms of Use",
            search_placeholder: "Search the site..."
        },
        ru: {
            nav_winter: "ЗИМА",
            nav_discover: "ОБЗОР",
            nav_mountain: "ГОРА",
            nav_realestate: "НЕДВИЖИМОСТЬ",
            nav_summer: "ЛЕТО",
            nav_events: "СОБЫТИЯ",
            btn_safety: "БЕЗОПАСНОСТЬ И РИСКИ",
            btn_book: "ЗАБРОНИРОВАТЬ",
            weather_base: "ПОДНОЖИЕ",
            weather_summit: "ВЕРШИНА",
            weather_snow: "СНЕГ ЗА 24Ч",
            ski_conditions_title: "УСЛОВИЯ КАТАНИЯ НА ГОРЕ",
            btn_weather: "❄️ ПРОГНОЗ ПОГОДЫ",
            btn_hill_status: "🏔️ СТАТУС ТРАСС",
            btn_webcams: "📷 ВЕБ-КАМЕРЫ",
            btn_save_winter: "% СКИДКИ НА ЗИМУ",
            happening_title: "СЕЙЧАС НА КУРОРТЕ",
            card1_title: "СКИДКИ НА ЗИМУ ДО 15 НОЯБРЯ",
            card1_desc: "Раннее бронирование уже открыто! Забронируйте отдых в Ревелстоке до 15 ноября со скидкой до 40%.",
            learn_more: "ПОДРОБНЕЕ",
            card2_title: "СОБЫТИЯ",
            card2_desc: "Ревелсток предлагает насыщенную программу мероприятий круглый год для ярких впечатлений.",
            view_events: "ВСЕ СОБЫТИЯ",
            card3_title: "ЛЕТНИЙ ОТДЫХ",
            card3_desc: "Летом Ревелсток превращается в центр горного туризма и активных развлечений.",
            explore: "ОТКРЫТЬ",
            feat1_title: "ПРИКЛЮЧЕНИЯ ЖДУТ ЗДЕСЬ",
            feat1_desc: "Летом Ревелсток — это настоящая площадка для приключений. Попробуйте маунтинбайк, хайкинг, экскурсии и катание на аттракционе Pipe Mountain Coaster.",
            btn_summer_act: "ЛЕТНИЕ АКТИВНОСТИ",
            feat2_title: "PIPE MOUNTAIN COASTER",
            feat2_desc: "Прокатитесь на самом популярном летнем аттракционе Ревелстока! Две трассы родельбана подарят вам незабываемые эмоции.",
            toll_free: "БЕСПЛАТНЫЙ ЗВОНОК",
            international: "МЕЖДУНАРОДНЫЙ",
            more_info: "ИНФОРМАЦИЯ",
            link_contact: "Контакты",
            link_feedback: "Обратная связь",
            link_press: "Пресса и СМИ",
            link_policy: "Правила безопасности",
            btn_account: "МОЙ КАБИНЕТ",
            stay_connected: "БУДЬТЕ НА СВЯЗИ",
            subscribe_desc: "Подпишитесь на новости, эксклюзивные предложения и анонсы событий.",
            btn_signup: "ПОДПИСАТЬСЯ",
            privacy: "Конфиденциальность и Условия",
            search_placeholder: "Поиск по сайту..."
        }
    };

    // 2. ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА
    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        // Перевод placeholder в поиске
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = translations[lang].search_placeholder;
        }

        // Обновление состояния кнопок выбора языка
        document.getElementById('langEN').classList.toggle('active', lang === 'en');
        document.getElementById('langRU').classList.toggle('active', lang === 'ru');
    }

    // Слушатели кнопок EN / RU
    document.getElementById('langEN').addEventListener('click', () => setLanguage('en'));
    document.getElementById('langRU').addEventListener('click', () => setLanguage('ru'));


    // 3. МОБИЛЬНОЕ МЕНЮ (Гамбургер)
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // 4. СТРОКА ПОИСКА
    const searchBtn = document.getElementById('searchBtn');
    const searchBar = document.getElementById('searchBar');
    const closeSearch = document.getElementById('closeSearch');

    if (searchBtn && searchBar && closeSearch) {
        searchBtn.addEventListener('click', () => searchBar.classList.toggle('active'));
        closeSearch.addEventListener('click', () => searchBar.classList.remove('active'));
    }

    // 5. КАРУСЕЛЬ
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => track.scrollBy({ left: 320, behavior: 'smooth' }));
        prevBtn.addEventListener('click', () => track.scrollBy({ left: -320, behavior: 'smooth' }));
    }

    // 6. ИНТЕРАКТИВНОСТЬ КНОПОК
    document.querySelectorAll('.js-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = currentLang === 'ru' ? 'Вы нажали кнопку: ' : 'You clicked: ';
            alert(msg + btn.innerText);
        });
    });

    document.getElementById('newsletterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = currentLang === 'ru' ? 'Спасибо за подписку!' : 'Thank you for subscribing!';
        alert(msg);
        e.target.reset();
    });
});