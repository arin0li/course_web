let currentSlide = 0;

function moveSlide(direction) {
    const track = document.getElementById("galleryTrack");
    const slides = document.querySelectorAll(".gallery-image");

    currentSlide += direction;

    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}
document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('botanicMap');
    if (mapElement) {
        const coords = [46.83085235234159, 29.642495671164205];
        const map = L.map('botanicMap').setView(coords, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        const marker = L.marker(coords).addTo(map);
        marker.bindPopup("<b>Ботанический сад Тирасполя</b><br>20,5 га коллекций деревьев и растений.");

        setTimeout(() => map.invalidateSize(), 100);
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

