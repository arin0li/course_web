// Исправленный map-attractions.js
// Важная правка: startKeep больше не вызывает window.scrollTo(0, savedScrollY) сразу,
// и восстанавливает позицию только если она была изменена извне.

document.addEventListener('DOMContentLoaded', function() {
    // Защита от пустых ссылок
    document.querySelectorAll('a[href=""], a[href="#"]').forEach(a => {
        a.addEventListener('click', function(e) { e.preventDefault(); });
    });

    // Плавная прокрутка до блока-героя
    document.querySelectorAll('a[href="#attractions-hero"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.getElementById('attractions-hero');
            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Инициализация карты
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = L.map('map', {
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        tap: true,
        inertia: true
    }).setView([46.8359, 29.6140], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''
    }).addTo(map);

    try {
        map.dragging && map.dragging.enable && map.dragging.enable();
    } catch (e) {}

    // Настройки контейнера карты (touch/overscroll)
    const mapContainer = map.getContainer && map.getContainer();
    if (mapContainer) {
        mapContainer.style.touchAction = 'none';
        mapContainer.style.msTouchAction = 'none';
        mapContainer.style.overscrollBehavior = 'contain';
        try { mapContainer.removeAttribute('tabindex'); } catch (err) {}
        ['pointerdown', 'mousedown', 'touchstart', 'click', 'wheel'].forEach(ev =>
            mapContainer.addEventListener(ev, e => e.stopPropagation(), { passive: true })
        );
        mapContainer.addEventListener('pointerdown', function() {
            try { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); } catch (err) {}
        }, { passive: true });
    }

    // Маркеры - создаются динамически из всех карточек на странице
    const sliderCards = document.querySelectorAll('.slider-card');
    const markers = [];
    
    sliderCards.forEach((card, index) => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            const titleElement = card.querySelector('.slider-card__title-click');
            const title = titleElement ? titleElement.textContent.replace(' →', '').trim() : `Достопримечательность ${index + 1}`;
            
            const marker = L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${title}</strong>`);
            markers.push(marker);
        } else {
            markers.push(null); // Сохраняем null для синхронизации индексов
        }
    });

    // Слайдер — синхронизация карточек и карты (sliderCards уже определен выше)
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const sliderTrack = document.querySelector('.slider-track');
    let currentIndex = 0;

    function updateSliderPosition(index) {
        if (!sliderTrack || !sliderCards.length) return;
        const gap = 20;
        const cardWidth = sliderCards[0].offsetWidth + gap;
        const containerWidth = sliderTrack.parentElement ? sliderTrack.parentElement.offsetWidth : 0;
        const scrollPosition = (cardWidth * index) - (containerWidth / 2) + (cardWidth / 2);
        sliderTrack.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }

    function activateCard(index) {
        sliderCards.forEach(c => c.classList.remove('active'));
        if (sliderCards[index]) {
            sliderCards[index].classList.add('active');
            const lat = parseFloat(sliderCards[index].dataset.lat);
            const lng = parseFloat(sliderCards[index].dataset.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                map.setView([lat, lng], 13);
            }
            if (markers[index] && markers[index] !== null) {
                markers[index].openPopup();
            }
            currentIndex = index;
        }
    }

    // Отслеживание двойного клика для перехода на страницу
    let lastClickTime = {};
    let clickTimeout = {};
    sliderCards.forEach((card, index) => {
        card.addEventListener('dblclick', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const url = card.dataset.url;
            if (url && url !== '#' && url !== '') {
                window.location.href = url;
            }
        }, { passive: false });
        
        card.addEventListener('click', function(e) {
            // Не блокируем клик, если это не карточка (например, кнопка избранного)
            if (e.target.closest('.favorite-btn-attraction')) {
                return;
            }
            
            const now = Date.now();
            const cardId = card.dataset.url || index;
            
            // Очищаем предыдущий таймаут для этой карточки
            if (clickTimeout[cardId]) {
                clearTimeout(clickTimeout[cardId]);
            }
            
            // Если это двойной клик (в течение 500мс)
            if (lastClickTime[cardId] && (now - lastClickTime[cardId]) < 500) {
                const url = card.dataset.url;
                if (url && url !== '#' && url !== '') {
                    window.location.href = url;
                    return;
                }
            }
            
            lastClickTime[cardId] = now;
            
            // Устанавливаем таймаут для активации карточки (чтобы не мешать двойному клику)
            clickTimeout[cardId] = setTimeout(() => {
                activateCard(index);
                updateSliderPosition(index);
            }, 300);
        }, { passive: false });
        if (markers[index] && markers[index] !== null) {
            markers[index].on('click', function(ev) {
                if (ev && ev.originalEvent) try { ev.originalEvent.stopPropagation(); } catch (err) {}
                activateCard(index); updateSliderPosition(index);
            });
        }
    });

    if (prevBtn) prevBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); const ni = currentIndex > 0 ? currentIndex - 1 : sliderCards.length - 1; activateCard(ni); updateSliderPosition(ni); }, { passive: false });
    if (nextBtn) nextBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); const ni = currentIndex < sliderCards.length - 1 ? currentIndex + 1 : 0; activateCard(ni); updateSliderPosition(ni); }, { passive: false });
    if (sliderCards.length) setTimeout(() => { activateCard(0); updateSliderPosition(0); }, 400);

    // Защита scroll во время drag/zoom (исправленная — НЕ вызывает немедленного scrollTo)
    (function() {
        let savedScrollY = null, keeper = null;
        function startKeep() {
            if (keeper) return;
            // Сохраняем текущую позицию страницы
            savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
            // Интервал будет восстанавливать позицию ТОЛЬКО если её действительно изменили извне
            keeper = setInterval(function() {
                const cur = window.pageYOffset || document.documentElement.scrollTop || 0;
                if (Math.abs(cur - savedScrollY) > 1) {
                    window.scrollTo(0, savedScrollY);
                }
            }, 50);
            // НЕ вызываем window.scrollTo сразу — это могло вызвать прыжок
        }
        function stopKeep() {
            if (keeper) { clearInterval(keeper); keeper = null; }
            if (savedScrollY !== null) {
                // один финальный восстановительный вызов с небольшой задержкой
                setTimeout(() => { window.scrollTo(0, savedScrollY || 0); savedScrollY = null; }, 50);
            }
        }
        if (map && map.on) {
            map.on('dragstart', startKeep);
            map.on('dragend', stopKeep);
            map.on('zoomstart', startKeep);
            map.on('zoomend', stopKeep);
        }
    })();

    // Удаление класса body.leaflet-dragging (MutationObserver + события)
    (function() {
        function removeLeafletDragging() {
            try {
                if (document.body.classList.contains('leaflet-dragging')) {
                    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
                    document.body.classList.remove('leaflet-dragging');
                    setTimeout(() => window.scrollTo(0, y), 0);
                }
            } catch (err) {}
        }
        if (map && map.on) {
            map.on('dragstart', removeLeafletDragging);
            map.on('drag', removeLeafletDragging);
            map.on('dragend', removeLeafletDragging);
        }
        if (mapContainer) {
            mapContainer.addEventListener('pointerdown', removeLeafletDragging, { passive: true });
            mapContainer.addEventListener('mousedown', removeLeafletDragging, { passive: true });
            mapContainer.addEventListener('touchstart', removeLeafletDragging, { passive: true });
        }
        try {
            const observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    if (m.type === 'attributes' && m.attributeName === 'class') {
                        if (document.body.classList.contains('leaflet-dragging')) removeLeafletDragging();
                    }
                }
            });
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        } catch (err) {}
    })();

    // Обновление размера карты
    setTimeout(() => { try { map.invalidateSize(); } catch (err) {} }, 800);
    window.addEventListener('resize', function() { try { map.invalidateSize(); } catch (err) {} });
});