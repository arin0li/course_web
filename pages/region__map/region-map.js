        // Инициализация карты региона с оптимизацией загрузки
        const regionMap = L.map('regionMap', {
            zoomControl: true,
            preferCanvas: true // Использует Canvas вместо SVG для лучшей производительности
        }).setView([47.0, 29.0], 7); // Уменьшен zoom для более быстрой загрузки

        // Используем более легкий тайловый слой
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            minZoom: 6,
            tileSize: 256,
            zoomOffset: 0
        }).addTo(regionMap);

        // Маршруты с координатами и сложностью
        const routes = [
            {
                name: 'Север Приднестровья – «Террасы над Днестром»',
                coords: [48.03488652169475, 28.68529999814944],
                difficulty: 'easy',
                url: '../routes-page/kamenka-terassi/kamenka-routes.html'
            },
            {
                name: 'Центральный Регион - «Зелёный Пульс Тирасполя»',
                coords: [46.834, 29.626],
                difficulty: 'easy',
                url: '../routes-page/central-region/greenTiraspol.html'
            },
            {
                name: 'Южный Регион - «Днестр в Тени Парка»',
                coords: [46.820, 29.483],
                difficulty: 'easy',
                url: '../routes-page/benderDnestr/bender.html'
            },
            {
                name: 'Слободзейский Район - «Гроты и Рукав Турунчук»',
                coords: [46.673, 29.760],
                difficulty: 'easy',
                url: '../routes-page/parkTurunchik/parkTuruncuk.html'
            },
            {
                name: 'Дубоссары: озелённый берег за полдня',
                coords: [47.279, 29.127],
                difficulty: 'easy',
                url: '../routes-page/dubossary/dubossary.html'
            },
            {
                name: 'Зелёное кольцо столицы',
                coords: [46.842, 29.633],
                difficulty: 'easy',
                url: '../routes-page/greenPulseTiraspol/pulseTiraspol.html'
            },
            {
                name: 'Зелёное сердце Днестра',
                coords: [47.376, 29.185],
                difficulty: 'medium',
                url: '../routes-page/yagorlyk/yagorlyk.html'
            },
            {
                name: 'Рашков — деревня скал и видов',
                coords: [47.942, 28.839],
                difficulty: 'medium',
                url: '../routes-page/rashkov/rashkov.html'
            }
        ];

        // Цвета для сложности
        const difficultyColors = {
            easy: '#6ADB90',
            medium: '#FFD700',
            hard: '#FF6B6B'
        };

        // Добавление маркеров на карту с задержкой для оптимизации
        // Загружаем маркеры после того, как карта полностью загрузится
        regionMap.whenReady(function() {
            setTimeout(function() {
                routes.forEach(route => {
                    const color = difficultyColors[route.difficulty] || '#6ADB90';
                    const marker = L.circleMarker(route.coords, {
                        radius: 10,
                        fillColor: color,
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(regionMap);

                    marker.bindPopup(`
                        <b>${route.name}</b><br>
                        <a href="${route.url}" style="color: #4B99B2; text-decoration: none;">Подробнее →</a>
                    `);
                });
            }, 100); // Небольшая задержка для плавной загрузки
        });