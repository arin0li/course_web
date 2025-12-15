/**
 * ============================================
 * ROUTES: Экологические маршруты
 * Туристические маршруты по регионам ПМР
 * ============================================
 * 
 * Маршруты: Бендеры-Днестр, Дубоссары, Каменка,
 * Рашков, Ягорлык, Парк Турунчук и др.
 */

// Загрузка данных маршрутов из JSON и динамическое создание карточек
document.addEventListener('DOMContentLoaded', function() {
  const routesGrid = document.querySelector('.routes-grid');
  if (!routesGrid) return;

  // Функция для получения класса сложности
  function getDifficultyClass(difficulty) {
    const difficultyMap = {
      'очень легкая': 'tag--easy',
      'легкая': 'tag--easy',
      'нормальная': 'tag--medium',
      'сложная': 'tag--hard'
    };
    return difficultyMap[difficulty.toLowerCase()] || 'tag--easy';
  }

  // Функция для получения текста сложности для отображения
  function getDifficultyText(difficulty) {
    const textMap = {
      'очень легкая': 'Легкая',
      'легкая': 'Легкая',
      'нормальная': 'Нормальная',
      'сложная': 'Сложная'
    };
    return textMap[difficulty.toLowerCase()] || difficulty;
  }

  // Функция для создания карточки маршрута
  function createRouteCard(route) {
    const article = document.createElement('article');
    article.className = 'route-card';
    
    // Определяем формат региона
    const regionText = route.region.includes('Город:') 
      ? route.region 
      : `Регион: ${route.region}`;

    article.innerHTML = `
      <button class="favorite-btn-route" 
              data-route-id="${route.id}" 
              data-route-title="${route.title}" 
              data-route-desc="${route.description}" 
              data-route-image="${route.image}">
        <i class="far fa-heart"></i>
      </button>
      <img src="${route.image}" alt="${route.title}" class="route-card__img">
      <div class="route-card__content">
        <h3 class="route-card__title">${route.title}</h3>
        <p class="route-card__region">${regionText}</p>
        <p class="route-card__desc">${route.description}</p>
        <div class="route-card__tags">
          <span class="tag tag--difficulty ${getDifficultyClass(route.difficulty)}">${getDifficultyText(route.difficulty)}</span>
          ${route.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        ${route.link ? `<a href="${route.link}" class="route-card__btn">Подробнее →</a>` : ''}
      </div>
    `;

    return article;
  }

  // Загрузка данных из JSON через axios
  axios.get('../blocks/card__json/routes-data.json')
    .then(function(response) {
      const routes = response.data.routes;
      
      // Очищаем контейнер
      routesGrid.innerHTML = '';
      
      // Создаем карточки для каждого маршрута
      routes.forEach(route => {
        const card = createRouteCard(route);
        routesGrid.appendChild(card);
      });

      // Инициализируем систему избранного после создания карточек
      initFavoritesButtons();

      // Инициализируем пагинацию после создания карточек
      if (typeof initPagination === 'function') {
        initPagination();
      }

      // Инициализируем фильтры после создания карточек
      if (typeof initFilters === 'function') {
        initFilters(routes);
      }

      // Инициализируем поиск после создания карточек
      initSearch();
    })
    .catch(function(error) {
      console.error('Ошибка загрузки данных маршрутов:', error);
      routesGrid.innerHTML = '<p class="error-message">Не удалось загрузить маршруты. Пожалуйста, обновите страницу.</p>';
    });
});

// Инициализация поиска
function initSearch() {
  const searchInput = document.getElementById('route-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      const routeCards = document.querySelectorAll('.route-card');

      routeCards.forEach(card => {
        const title = card.querySelector('.route-card__title')?.textContent.toLowerCase() || '';
        const region = card.querySelector('.route-card__region')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.route-card__desc')?.textContent.toLowerCase() || '';
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

        const matches = title.includes(searchTerm) || 
                       region.includes(searchTerm) || 
                       desc.includes(searchTerm) || 
                       tags.includes(searchTerm);

        card.style.display = matches ? 'flex' : 'none';
      });

      // Обновляем пагинацию после поиска
      if (typeof updatePaginationAfterFilter === 'function') {
        updatePaginationAfterFilter();
      }
    });
  }
}

// Инициализация кнопок избранного для динамически созданных карточек
function initFavoritesButtons() {
  if (typeof FavoritesManager === 'undefined') return;
  
  const favoritesManager = new FavoritesManager();
  
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
        image: btn.dataset.routeImage || ''
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
}
