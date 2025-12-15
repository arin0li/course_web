// Фильтрация и сортировка маршрутов
let routesData = {}; // Будет заполнено данными из JSON

// Функция инициализации фильтров (вызывается из routes-script.js после загрузки данных)
window.initFilters = function(routes) {
  // Преобразуем массив маршрутов в объект для быстрого доступа
  routesData = {};
  routes.forEach(route => {
    routesData[route.id] = {
      season: route.season,
      difficulty: route.difficulty,
      city: route.city,
      length: route.length,
      popularity: route.popularity || 0,
      duration: route.duration || 0
    };
  });

  const routeCards = document.querySelectorAll('.route-card');
  const filterCheckboxes = document.querySelectorAll('.custom-checkbox input[type="checkbox"]');
  const filterRadios = document.querySelectorAll('.custom-radio input[type="radio"]');
  const sortSelect = document.getElementById('route-sort');
  const filtersShowBtn = document.querySelector('.filters__show-btn');

  // Функция применения фильтров
  function applyFilters() {
    const selectedSeasons = Array.from(document.querySelectorAll('.filter-accordion:first-of-type .custom-checkbox input[type="checkbox"]:checked'))
      .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    
    const selectedDifficulties = Array.from(document.querySelectorAll('.filter-accordion:nth-of-type(2) .custom-checkbox input[type="checkbox"]:checked'))
      .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    
    const selectedCities = Array.from(document.querySelectorAll('.filter-accordion:nth-of-type(3) .custom-checkbox input[type="checkbox"]:checked'))
      .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    
    const selectedLength = document.querySelector('.custom-radio input[type="radio"]:checked');
    let lengthValue = null;
    if (selectedLength) {
      const lengthText = selectedLength.parentElement.textContent.trim();
      if (lengthText.includes('5–10') || lengthText.includes('5-10')) {
        lengthValue = '5-10';
      } else if (lengthText.includes('10–20') || lengthText.includes('10-20')) {
        lengthValue = '10-20';
      } else if (lengthText.includes('Больше 20') || lengthText.includes('20+')) {
        lengthValue = '20+';
      }
    }

    routeCards.forEach(card => {
      const favoriteBtn = card.querySelector('.favorite-btn-route');
      const routeId = favoriteBtn ? favoriteBtn.dataset.routeId : null;
      
      if (!routeId || !routesData[routeId]) {
        card.style.display = 'none';
        return;
      }

      const data = routesData[routeId];
      let show = true;

      // Фильтр по сезону
      if (selectedSeasons.length > 0) {
        const hasSeason = selectedSeasons.some(season => {
          const seasonLower = season.toLowerCase();
          return data.season.some(s => s.includes(seasonLower) || seasonLower.includes(s));
        });
        if (!hasSeason) show = false;
      }

      // Фильтр по сложности
      if (selectedDifficulties.length > 0) {
        const difficultyMatch = selectedDifficulties.some(diff => {
          const diffLower = diff.toLowerCase();
          const dataDiff = data.difficulty.toLowerCase();
          
          // Маппинг сложности
          if (diffLower.includes('легк') && (dataDiff.includes('легк') || dataDiff.includes('очень легк'))) {
            return true;
          }
          if (diffLower.includes('нормальн') && dataDiff.includes('нормальн')) {
            return true;
          }
          if (diffLower.includes('сложн') && dataDiff.includes('сложн')) {
            return true;
          }
          return false;
        });
        if (!difficultyMatch) show = false;
      }

      // Фильтр по городу
      if (selectedCities.length > 0) {
        const cityMatch = selectedCities.some(city => {
          const cityLower = city.toLowerCase();
          return data.city.toLowerCase().includes(cityLower) || cityLower.includes(data.city.toLowerCase());
        });
        if (!cityMatch) show = false;
      }

      // Фильтр по длине
      if (lengthValue) {
        if (data.length !== lengthValue) {
          show = false;
        }
      }

      card.style.display = show ? 'flex' : 'none';
    });

    // Обновляем пагинацию после фильтрации
    if (typeof updatePaginationAfterFilter === 'function') {
      updatePaginationAfterFilter();
    }
  }

  // Применяем фильтры при нажатии кнопки "Показать"
  if (filtersShowBtn) {
    filtersShowBtn.addEventListener('click', applyFilters);
  }

  // Кнопка сброса фильтров
  const resetBtn = document.querySelector('.filters-panel__reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      // Сбрасываем все чекбоксы
      document.querySelectorAll('.custom-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });

      // Сбрасываем все радиокнопки
      document.querySelectorAll('.custom-radio input[type="radio"]').forEach(radio => {
        radio.checked = false;
      });

      // Показываем все карточки
      routeCards.forEach(card => {
        card.style.display = 'flex';
      });

      // Обновляем пагинацию
      if (typeof updatePaginationAfterFilter === 'function') {
        updatePaginationAfterFilter();
      }
    });
  }

  // Сортировка маршрутов
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      const cardsArray = Array.from(routeCards).filter(card => {
        return card.style.display !== 'none';
      });
      const grid = document.querySelector('.routes-grid');
      
      if (!grid) return;

      if (sortValue === 'popularity') {
        // Сортировка по популярности (по убыванию)
        cardsArray.sort((a, b) => {
          const aId = a.querySelector('.favorite-btn-route')?.dataset.routeId;
          const bId = b.querySelector('.favorite-btn-route')?.dataset.routeId;
          const aPopularity = routesData[aId]?.popularity || 0;
          const bPopularity = routesData[bId]?.popularity || 0;
          return bPopularity - aPopularity;
        });
        cardsArray.forEach(card => grid.appendChild(card));
      } else if (sortValue === 'newest') {
        // Сортировка по новизне (реверс порядка)
        cardsArray.reverse();
        cardsArray.forEach(card => grid.appendChild(card));
      } else if (sortValue === 'duration') {
        // Сортировка по длительности (по возрастанию)
        cardsArray.sort((a, b) => {
          const aId = a.querySelector('.favorite-btn-route')?.dataset.routeId;
          const bId = b.querySelector('.favorite-btn-route')?.dataset.routeId;
          const aDuration = routesData[aId]?.duration || 0;
          const bDuration = routesData[bId]?.duration || 0;
          return aDuration - bDuration;
        });
        cardsArray.forEach(card => grid.appendChild(card));
      }

      // Обновляем пагинацию после сортировки
      if (typeof updatePaginationAfterFilter === 'function') {
        updatePaginationAfterFilter();
      }
    });
  }
};
