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
const map = L.map('yagorlykMap').setView([47.376, 29.185], 12);

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
    name: "Обзорная площадка",
    coords: [47.38265398219481, 29.200663308246025],
    description: "Первая обзорная точка с панорамой Днестра и заливов.",
    icon: defaultIcon
  },
  {
    name: "Заповедник Ягорлык",
    coords: [47.39390534220394, 29.192449236904068],
    description: "Заповедник Ягорлык — сердце маршрута, тишина и заливы.",
    icon: parkIcon
  },
  {
    name: "Обзорка Ягорлык",
    coords: [47.387701019897015, 29.17577164724111],
    description: "Смотровая «Ягорлык» — широкий поворот реки и камышовые плёсы.",
    icon: defaultIcon
  },
  {
    name: "Кемпинг",
    coords: [47.37174733136675, 29.16680234044494],
    description: "Кемпинговая точка — удобная остановка у старой поймы.",
    icon: defaultIcon
  },
  {
    name: "Обзорка у с. Роги",
    coords: [47.32630872557619, 29.11821069730992],
    description: "Обзорная площадка у с. Роги — финальная панорама Днестра.",
    icon: defaultIcon
  }
];

// Добавляем маркеры
points.forEach(point => {
  L.marker(point.coords, { icon: point.icon })
    .addTo(map)
    .bindPopup(`<b>${point.name}</b><br>${point.description}`);
});

// Маршрут по дорогам (авто/пеший) через все точки
L.Routing.control({
  waypoints: points.map(p => L.latLng(p.coords[0], p.coords[1])),
  routeWhileDragging: false,
  show: false,
  lineOptions: {
    styles: [{ color: '#4B99B2', opacity: 0.8, weight: 6 }]
  },
  createMarker: () => null
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
  view1: { name: "Обзорная площадка", coords: [47.38265398219481, 29.200663308246025] },
  yagor: { name: "Заповедник Ягорлык", coords: [47.39390534220394, 29.192449236904068] },
  view2: { name: "Обзорка Ягорлык", coords: [47.387701019897015, 29.17577164724111] },
  camp:  { name: "Кемпинг", coords: [47.37174733136675, 29.16680234044494] },
  rogi:  { name: "Обзорка у с. Роги", coords: [47.32630872557619, 29.11821069730992] }
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
      name: "Лайт (Обзорная → Заповедник Ягорлык)", 
      distance: calculateTotalDistance([points.view1, points.yagor]),
      difficulty: 1.0,
      waypoints: [points.view1, points.yagor],
      center: [47.388, 29.196]
    },
    standard: { 
      name: "Стандарт (Все точки маршрута)", 
      distance: calculateTotalDistance([points.view1, points.yagor, points.view2, points.camp, points.rogi]),
      difficulty: 1.0,
      waypoints: [points.view1, points.yagor, points.view2, points.camp, points.rogi],
      center: [47.365, 29.170]
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
      ${r.difficulty === 1.0 && r.waypoints.length === 2 ? 'Короткая часть маршрута: от первой обзорки к заповеднику — чтобы увидеть туман у воды и заливы.' :
        'Полный маршрут по всем смотровым и кемпингу: почувствовать спокойное «сердце» Днестра от Гоян до Рогов.'}
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
  

 