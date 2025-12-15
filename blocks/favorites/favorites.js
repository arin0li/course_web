// Система управления избранным
class FavoritesManager {
  constructor() {
    this.storageKey = 'ecotravel_favorites';
    this.favorites = this.loadFavorites();
  }

  loadFavorites() {
    const stored = localStorage.getItem(this.storageKey);
    const favorites = stored ? JSON.parse(stored) : { routes: [], attractions: [] };
    // Удаляем дубликаты при загрузке
    this.removeDuplicates(favorites);
    return favorites;
  }

  removeDuplicates(favorites) {
    // Удаляем дубликаты маршрутов по id
    const seenRoutes = new Set();
    favorites.routes = favorites.routes.filter(route => {
      if (seenRoutes.has(route.id)) {
        return false;
      }
      seenRoutes.add(route.id);
      return true;
    });

    // Удаляем дубликаты достопримечательностей по id
    const seenAttractions = new Set();
    favorites.attractions = favorites.attractions.filter(attraction => {
      if (seenAttractions.has(attraction.id)) {
        return false;
      }
      seenAttractions.add(attraction.id);
      return true;
    });
  }

  saveFavorites() {
    // Удаляем дубликаты перед сохранением
    this.removeDuplicates(this.favorites);
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    this.updateFavoritesCount();
  }

  addRoute(routeId, routeData) {
    // Удаляем дубликаты перед проверкой
    this.removeDuplicates(this.favorites);
    
    // Проверяем, нет ли уже такого маршрута
    const existingIndex = this.favorites.routes.findIndex(r => r.id === routeId);
    if (existingIndex === -1) {
      this.favorites.routes.push({ id: routeId, ...routeData });
      this.saveFavorites();
      return true;
    }
    // Если уже есть, обновляем данные (на случай, если изменились)
    this.favorites.routes[existingIndex] = { id: routeId, ...routeData };
    this.saveFavorites();
    return false; // Не добавляли новый, значит false
  }

  removeRoute(routeId) {
    this.favorites.routes = this.favorites.routes.filter(r => r.id !== routeId);
    this.saveFavorites();
    return true;
  }

  addAttraction(attractionId, attractionData) {
    // Удаляем дубликаты перед проверкой
    this.removeDuplicates(this.favorites);
    
    // Проверяем, нет ли уже такой достопримечательности
    const existingIndex = this.favorites.attractions.findIndex(a => a.id === attractionId);
    if (existingIndex === -1) {
      this.favorites.attractions.push({ id: attractionId, ...attractionData });
      this.saveFavorites();
      return true;
    }
    // Если уже есть, обновляем данные (на случай, если изменились)
    this.favorites.attractions[existingIndex] = { id: attractionId, ...attractionData };
    this.saveFavorites();
    return false; // Не добавляли новый, значит false
  }

  removeAttraction(attractionId) {
    this.favorites.attractions = this.favorites.attractions.filter(a => a.id !== attractionId);
    this.saveFavorites();
    return true;
  }

  isRouteFavorite(routeId) {
    return this.favorites.routes.some(r => r.id === routeId);
  }

  isAttractionFavorite(attractionId) {
    return this.favorites.attractions.some(a => a.id === attractionId);
  }

  getAllFavorites() {
    // Удаляем дубликаты перед возвратом
    this.removeDuplicates(this.favorites);
    // Сохраняем очищенные данные (без обновления счетчика, чтобы не было лишних обновлений)
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    return this.favorites;
  }

  updateFavoritesCount() {
    const count = this.favorites.routes.length + this.favorites.attractions.length;
    const countElement = document.querySelector('.favorites-count');
    if (countElement) {
      countElement.textContent = count;
      countElement.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  toggleRoute(routeId, routeData) {
    if (this.isRouteFavorite(routeId)) {
      this.removeRoute(routeId);
      return false;
    } else {
      this.addRoute(routeId, routeData);
      return true;
    }
  }

  toggleAttraction(attractionId, attractionData) {
    if (this.isAttractionFavorite(attractionId)) {
      this.removeAttraction(attractionId);
      return false;
    } else {
      this.addAttraction(attractionId, attractionData);
      return true;
    }
  }
}

// Глобальный экземпляр
const favoritesManager = new FavoritesManager();

// Инициализация кнопок избранного
document.addEventListener('DOMContentLoaded', function() {
  // Обновляем счетчик при загрузке (с небольшой задержкой для гарантии)
  setTimeout(() => {
    favoritesManager.updateFavoritesCount();
  }, 100);

  // Вспомогательные функции для получения корректных картинок
  const toAbsolute = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
    try {
      return new URL(path, window.location.href).href;
    } catch (e) {
      return path;
    }
  };

  // Запасные карты соответствий id -> путь к изображению
  const ROUTE_IMAGE_MAP = {
    'north-pmr': 'routes-page/kamenka-terassi/images/Rashkov1.jpg',
    'tiraspol': 'routes-page/central-region/images/ecat2.jpg',
    'bender-south': 'routes-page/benderDnestr/images/naberej.jpg',
    'slobodzeya': 'routes-page/parkTurunchik/images/rodina6.jpg',
    'dubossary': 'routes-page/dubossary/images/dubossary.jpg',
    'tiraspol-ring': 'routes-page/greenPulseTiraspol/images/park1.jpg',
    'dnestr-heart': 'routes-page/yagorlyk/images/yun_0001-2.jpg'
  };

  const ATTRACTION_IMAGE_MAP = {
    'turunchuk': 'pages/attraction-page/turunchuk/turunchuk-hero.jpg',
    'vineyards': 'assets/images/grape_tiras.jpg',
    'rodina': 'pages/attraction-page/park-rodina/images/rodina1.jpg',
    'wittgenstein': 'pages/attraction-page/park-vingsteina/images/park1.jpg',
    'botanic': 'pages/attraction-page/botanic-garden/images/botanic1.jpg',
    'kitskansky-forest': 'pages/attraction-page/kitskanski-forest/images/kitsk1.jpg',
    'kuchurgan-liman': 'pages/attraction-page/kuchurgan-liman/images/liman.jpeg',
    'lavender-field': 'pages/attraction-page/lavandovoe-pole/images/lavanda.jpg',
    'vykhvatintsy-caves': 'pages/attraction-page/yagorlyk/images/yag.jpg'
  };

  const routeImages = {};
  const attractionImages = {};

  // Собираем src реальных картинок с карточек маршрутов/аттракционов
  document.querySelectorAll('.favorite-btn-route').forEach(btn => {
    const id = btn.dataset.routeId;
    if (!id) return;
    const imgEl = btn.closest('.route-card, article, .slider-card')?.querySelector('img');
    const src = imgEl?.src || btn.dataset.routeImage;
    if (src) routeImages[id] = imgEl?.src ? imgEl.src : toAbsolute(src);
  });

  document.querySelectorAll('.favorite-btn-attraction').forEach(btn => {
    const id = btn.dataset.attractionId;
    if (!id) return;
    const imgEl = btn.closest('.slider-card, .attraction-card, article')?.querySelector('img');
    const src = imgEl?.src || btn.dataset.attractionImage;
    if (src) attractionImages[id] = imgEl?.src ? imgEl.src : toAbsolute(src);
  });

  const getRouteImage = (id, datasetImage) => {
    if (routeImages[id]) return routeImages[id];
    if (ROUTE_IMAGE_MAP[id]) return toAbsolute(ROUTE_IMAGE_MAP[id]);
    return toAbsolute(datasetImage || '');
  };

  const getAttractionImage = (id, datasetImage) => {
    if (attractionImages[id]) return attractionImages[id];
    if (ATTRACTION_IMAGE_MAP[id]) return toAbsolute(ATTRACTION_IMAGE_MAP[id]);
    return toAbsolute(datasetImage || '');
  };

  // Кнопка "Наверх" (общая для всех страниц, где подключен favorites.js)
  (function initBackToTop() {
    const ensureStyles = () => {
      if (document.getElementById('back-to-top-styles')) return;
      const style = document.createElement('style');
      style.id = 'back-to-top-styles';
      style.textContent = `
        .back-to-top-btn {
          position: fixed !important;
          right: 20px !important;
          bottom: 24px !important;
          width: 44px !important;
          height: 44px !important;
          background: linear-gradient(135deg, #6adb90, #4B99B2) !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 50% !important;
          box-shadow: 0 6px 20px rgba(106, 219, 144, 0.4) !important;
          cursor: pointer !important;
          font-size: 20px !important;
          font-weight: 700 !important;
          font-family: 'Rubik', sans-serif !important;
          z-index: 9999 !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transform: translateY(20px) scale(0.8) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .back-to-top-btn.visible {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) scale(1) !important;
        }

        .back-to-top-btn:hover {
          transform: translateY(-4px) scale(1.1) !important;
          box-shadow: 0 12px 30px rgba(106, 219, 144, 0.5) !important;
        }

        .back-to-top-btn:active {
          transform: translateY(0) scale(0.95) !important;
        }

        @media (max-width: 1279px) {
          .back-to-top-btn {
            width: 50px !important;
            height: 50px !important;
            font-size: 22px !important;
            right: 22px !important;
            bottom: 26px !important;
          }
        }

        @media (max-width: 1024px) {
          .back-to-top-btn {
            width: 76px !important;
            height: 76px !important;
            font-size: 24px !important;
            right: 24px !important;
            bottom: 28px !important;
            box-shadow: 0 8px 24px rgba(106, 219, 144, 0.45) !important;
          }
        }

        @media (max-width: 767px) {
          .back-to-top-btn {
            width: 60px !important;
            height: 60px !important;
            font-size: 26px !important;
            right: 18px !important;
            bottom: 20px !important;
            box-shadow: 0 8px 28px rgba(106, 219, 144, 0.5) !important;
          }
        }

        @media (max-width: 480px) {
          .back-to-top-btn {
            width: 84px !important;
            height: 84px !important;
            font-size: 28px !important;
            right: 16px !important;
            bottom: 18px !important;
          }
        }

        @media (max-width: 380px) {
          .back-to-top-btn {
            width: 58px !important;
            height: 58px !important;
            font-size: 26px !important;
            right: 12px !important;
            bottom: 14px !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    ensureStyles();

    // Не создаём дубликат, если кнопка уже добавлена другим скриптом
    if (document.querySelector('.back-to-top-btn')) return;

    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.setAttribute('aria-label', 'Наверх');
    btn.className = 'back-to-top-btn';

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(btn);

    const toggleVisibility = () => {
      const shouldShow = window.scrollY > 400;
      btn.classList.toggle('visible', shouldShow);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility);
  })();

  // Инициализируем кнопки избранного для маршрутов
  document.querySelectorAll('.favorite-btn-route').forEach(btn => {
    const routeId = btn.dataset.routeId;
    if (routeId && favoritesManager.isRouteFavorite(routeId)) {
      btn.classList.add('active');
      btn.querySelector('i').classList.remove('far');
      btn.querySelector('i').classList.add('fas');
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const routeData = {
        title: btn.dataset.routeTitle || '',
        description: btn.dataset.routeDesc || '',
        image: getRouteImage(routeId, btn.dataset.routeImage)
      };
      const isFavorite = favoritesManager.toggleRoute(routeId, routeData);
      if (isFavorite) {
        btn.classList.add('active');
        btn.querySelector('i').classList.remove('far');
        btn.querySelector('i').classList.add('fas');
      } else {
        btn.classList.remove('active');
        btn.querySelector('i').classList.remove('fas');
        btn.querySelector('i').classList.add('far');
      }
      favoritesManager.updateFavoritesCount();
    });
  });

  // Инициализируем кнопки избранного для достопримечательностей
  document.querySelectorAll('.favorite-btn-attraction').forEach(btn => {
    const attractionId = btn.dataset.attractionId;
    if (attractionId && favoritesManager.isAttractionFavorite(attractionId)) {
      btn.classList.add('active');
      btn.querySelector('i').classList.remove('far');
      btn.querySelector('i').classList.add('fas');
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const attractionData = {
        title: btn.dataset.attractionTitle || '',
        description: btn.dataset.attractionDesc || '',
        image: getAttractionImage(attractionId, btn.dataset.attractionImage)
      };
      const isFavorite = favoritesManager.toggleAttraction(attractionId, attractionData);
      if (isFavorite) {
        btn.classList.add('active');
        btn.querySelector('i').classList.remove('far');
        btn.querySelector('i').classList.add('fas');
      } else {
        btn.classList.remove('active');
        btn.querySelector('i').classList.remove('fas');
        btn.querySelector('i').classList.add('far');
      }
      favoritesManager.updateFavoritesCount();
    });
  });
});

