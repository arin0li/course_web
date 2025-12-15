// Фильтрация достопримечательностей
document.addEventListener('DOMContentLoaded', function() {
  const sliderCards = document.querySelectorAll('.slider-card');
  const regionSelect = document.querySelectorAll('.sort__select')[1]; // Второй select для региона
  const showBtn = document.querySelector('.toolbar__show-btn');

  // Данные достопримечательностей для фильтрации
  const attractionData = {
    'turunchuk': {
      region: 'слободзея'
    },
    'vineyards': {
      region: 'каменка'
    },
    'rodina': {
      region: 'бендеры'
    },
    'wittgenstein': {
      region: 'каменка'
    },
    'botanic': {
      region: 'тирасполь'
    }
  };

  function applyFilters() {
    const selectedRegion = regionSelect ? regionSelect.value.toLowerCase() : 'все';
    
    if (selectedRegion === 'все' || selectedRegion === 'регион: все') {
      // Показываем все карточки
      sliderCards.forEach(card => {
        card.style.display = 'block';
      });
      return;
    }

    sliderCards.forEach(card => {
      const favoriteBtn = card.querySelector('.favorite-btn-attraction');
      const attractionId = favoriteBtn ? favoriteBtn.dataset.attractionId : null;
      
      if (!attractionId || !attractionData[attractionId]) {
        card.style.display = 'block'; // Показываем по умолчанию
        return;
      }

      const data = attractionData[attractionId];
      const regionMatch = selectedRegion.includes(data.region) || data.region.includes(selectedRegion);
      
      card.style.display = regionMatch ? 'block' : 'none';
    });
  }

  // Применяем фильтры только при нажатии кнопки "Показать"
  if (showBtn) {
    showBtn.addEventListener('click', applyFilters);
  }

  // При изменении региона тоже применяем фильтры (можно оставить автоматическое)
  if (regionSelect) {
    regionSelect.addEventListener('change', applyFilters);
  }
});

