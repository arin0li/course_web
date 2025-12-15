let currentSlide = 0;

const track = document.getElementById("galleryTrack");
const slides = document.querySelectorAll(".gallery-image");
const totalSlides = slides.length;

const prevBtn = document.querySelector(".nav-btn.prev");
const nextBtn = document.querySelector(".nav-btn.next");

// Функция прокрутки
function moveSlide(direction) {
    currentSlide += direction;

    // Зацикливание
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Вешаем обработчики на кнопки
prevBtn.addEventListener("click", () => moveSlide(-1));
nextBtn.addEventListener("click", () => moveSlide(1));

// Опционально: поддержка клавиш ← →
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveSlide(-1);
    if (e.key === "ArrowRight") moveSlide(1);
});




 // Создаём карту
// Создаём карту
const map = L.map('benderMap').setView([46.820, 29.483], 13);

// Добавляем слой карты
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Кастомные иконки
const parkIcon = L.icon({
  iconUrl: 'images/parkIcon8.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

// Точки маршрута
const points = [
  {
    name: "Парк Александра Невского",
    coords: [46.83607918954442, 29.487739186505888],
    description: "Парк Александра Невского — ухоженный и просторный парк в южной части Тирасполя.",
    icon: parkIcon
  },
  {
    name: "Набережная Днестра",
    coords: [46.82420652826543, 29.49058365159421],
    description: "Набережная Днестра — светлые аллеи, где Днестр выглядит спокойным и широким.",
    icon: defaultIcon
  },
  {
    name: "Лесополоса у реки",
    coords: [46.83610829573143, 29.487692448719073],
    description: "Лесополоса у реки — тихое место с высокими ивами, тенью тополей и пением птиц.",
    icon: defaultIcon
  },
  {
    name: "Парк 40 лет Победы",
    coords: [46.80347830440076, 29.467733874035105],
    description: "Парк 40 лет Победы — уютный парк с зелёными аллеями и местами для отдыха.",
    icon: defaultIcon
  }
];

// Добавляем маркеры
points.forEach(point => {
  L.marker(point.coords, { icon: point.icon })
    .addTo(map)
    .bindPopup(`<b>${point.name}</b><br>${point.description}`);
});

// Маршрут по дорогам
L.Routing.control({
  waypoints: points.map(p => L.latLng(p.coords[0], p.coords[1])),
  routeWhileDragging: false,
  show: false,
  lineOptions: {
    styles: [{ color: '#4B99B2', opacity: 0.8, weight: 6 }]
  },
  createMarker: function() { return null; }
}).addTo(map);




// === КАЛЬКУЛЯТОР ПО ФОРМУЛЕ ИЗ СТАТЬИ ГУРКИНОЙ И ЖУЛИНОЙ ===

let resultMap = null;
let currentRoutingControl = null; // Чтобы удалять старый маршрут

document.getElementById('groupSize').addEventListener('input', function() {
  document.getElementById('groupValue').textContent = this.value;
});

document.getElementById('calcSubmit').addEventListener('click', function() {
  const levelInput = document.querySelector('input[name="level"]:checked');
  const routeInput = document.querySelector('input[name="route"]:checked');

  if (!levelInput || !routeInput) {
    alert('Выберите уровень и маршрут!');
    return;
  }

  // === ТОЧКИ НА КАРТЕ ===
  const points = {
    park:        { name: "Парк Александра Невского", coords: [46.83607918954442, 29.487739186505888] },
    naberezhnaya: { name: "Набережная Днестра", coords: [46.82420652826543, 29.49058365159421] },
    lesopolosa:  { name: "Лесополоса у реки", coords: [46.83610829573143, 29.487692448719073] },
    park40let:   { name: "Парк 40 лет Победы", coords: [46.80347830440076, 29.467733874035105] }
  };

  // Функция расчета расстояния между точками (приблизительно)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Радиус Земли в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Функция расчета общего расстояния для массива точек
  function calculateTotalDistance(waypoints) {
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      total += calculateDistance(
        waypoints[i].coords[0],
        waypoints[i].coords[1],
        waypoints[i + 1].coords[0],
        waypoints[i + 1].coords[1]
      );
    }
    return Math.round(total * 10) / 10;
  }

  // === МАРШРУТЫ ===
  const routes = {
    light:    { 
      name: "Лайт (Парк Невского → Набережная)", 
      distance: calculateTotalDistance([points.park, points.naberezhnaya]),
      difficulty: 1.0, // Легкий
      waypoints: [points.park, points.naberezhnaya],
      center: [46.817, 29.479]
    },
    standard: { 
      name: "Стандарт (Полный маршрут: Парк → Набережная → Лесополоса → Парк 40 лет Победы)", 
      distance: calculateTotalDistance([points.park, points.naberezhnaya, points.lesopolosa, points.park40let]),
      difficulty: 1.0, // Легкий (маршрут легкий по описанию)
      waypoints: [points.park, points.naberezhnaya, points.lesopolosa, points.park40let],
      center: [46.818, 29.485]
    }
  };

  const r = routes[routeInput.value];
  const speed = { beginner: 3, average: 4, experienced: 5 }[levelInput.value];
  const group = document.getElementById('groupSize').value;

  // Расчёт времени по формуле: Время = (Дистанция / Скорость) × Коэффициент_сложности + Время_на_отдых
  const walkH = r.distance / speed; // Часы ходьбы
  const walkTime = walkH * r.difficulty; // Время с учетом коэффициента сложности
  const restTime = (12.5 / 60) * walkH; // Время на отдых (12.5 минут на каждый час ходьбы)
  const totalH = walkTime + restTime; // Общее время
  const h = Math.floor(totalH);
  const m = Math.round((totalH - h) * 60);

  // Результат
  document.getElementById('resultContent').innerHTML = `
    <p><strong>Маршрут:</strong> ${r.name}</p>
    <p><strong>Дистанция:</strong> ${r.distance} км</p>
    <p><strong>Время:</strong> <span style="color:#4B99B2;font-weight:700;">${h} ч ${m < 10 ? '0' : ''}${m} мин</span></p>
    <p><strong>Уровень:</strong> ${levelInput.parentNode.textContent.trim()}</p>
    <p><strong>Группа:</strong> ${group} чел.</p>
    <hr style="margin:20px 0;border-top:1px solid #eee;">
    <p style="font-size:15px;line-height:1.6;color:#555;">
      ${r.difficulty === 1.0 && r.waypoints.length === 2 ? 'Короткая прогулка от Парка Невского до набережной — для тех, кто хочет быстро насладиться видами Днестра и ухоженными аллеями.' :
        'Полный маршрут вдоль Днестра — для любителей природы, которые хотят увидеть разные настроения реки: от городской набережной до тихой лесополосы и уютного Парка 40 лет Победы.'}
    </p>
  `;

  const resultBlock = document.getElementById('resultBlock');
  resultBlock.style.display = 'block';

  // === КАРТА С МАРШРУТОМ ===
  setTimeout(() => {
    if (!resultMap) {
      resultMap = L.map('routeMap').setView(r.center, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(resultMap);
    } else {
      resultMap.setView(r.center, 13);
      if (currentRoutingControl) resultMap.removeControl(currentRoutingControl);
    }

    // Удаляем старые маркеры
    resultMap.eachLayer(l => { if (l instanceof L.Marker) resultMap.removeLayer(l); });

    // Рисуем маршрут
    currentRoutingControl = L.Routing.control({
      waypoints: r.waypoints.map(p => L.latLng(p.coords[0], p.coords[1])),
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      createMarker: (i, wp) => L.marker(wp.latLng).bindPopup(`<b>${r.waypoints[i].name}</b>`),
      lineOptions: { styles: [{ color: '#4B99B2', weight: 6, opacity: 0.8 }] }
    }).addTo(resultMap);

    resultMap.invalidateSize();
    resultBlock.scrollIntoView({ behavior: 'smooth' });
  }, 200);
});
  

 