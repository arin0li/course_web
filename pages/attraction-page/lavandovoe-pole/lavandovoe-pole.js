let currentSlide = 0;

function moveSlide(direction) {
    const track = document.getElementById("galleryTrack");
    const slides = document.querySelectorAll(".gallery-image");

    currentSlide += direction;

    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Инициализация карты после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('lavandovoe-poleMap');
    if (mapElement) {
        var map = L.map('lavandovoe-poleMap').setView([47.346516, 29.174850], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        var marker = L.marker([47.346516, 29.174850]).addTo(map);

        marker.bindPopup("<b>Лавандовое поле</b><br>Лавандовое поле у села Гояны.");
    }
});

// Функция для открытия модального окна
function openModal(category) {
    let modalId;
    
    switch(category) {
        case 'plants':
            modalId = 'plantsModal';
            break;
        case 'animals':
            modalId = 'animalsModal';
            break;
        case 'mushrooms':
            modalId = 'mushroomsModal';
            break;
        default:
            return;
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }
}

// Функция для закрытия модального окна
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Восстанавливаем скролл
    }
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Закрытие модального окна при нажатии ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

