let currentSlide = 0;

function moveSlide(direction) {
    const track = document.getElementById("galleryTrack");
    const slides = document.querySelectorAll(".gallery-image");

    currentSlide += direction;

    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}
var map = L.map('turunchukMap').setView([46.665402795019524, 29.765156120226266], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var marker = L.marker([46.665402795019524, 29.765156120226266]).addTo(map);

marker.bindPopup("<b>Река Турунчук</b><br>Живописное место между Чобручами и Красным.");



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
    
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
}

// Функция для закрытия модального окна
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto'; // Восстанавливаем скролл
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

