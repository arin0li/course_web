// Модальное окно избранного
document.addEventListener('DOMContentLoaded', function() {
  const favoritesLink = document.getElementById('favoritesLink');
  const favoritesModal = document.getElementById('modal-favorites');
  const favoritesContent = document.getElementById('favorites-content');

  if (favoritesLink) {
    favoritesLink.addEventListener('click', function(e) {
      e.preventDefault();
      updateFavoritesModal();
      favoritesModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }

  // Закрытие модального окна избранного
  if (favoritesModal) {
    const closeBtn = favoritesModal.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        favoritesModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }

    // Закрытие при клике вне модального окна
    favoritesModal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && favoritesModal.style.display === 'block') {
        favoritesModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  function updateFavoritesModal() {
    const favorites = favoritesManager.getAllFavorites();
    const allItems = [...favorites.routes.map(r => ({...r, type: 'route'})), 
                      ...favorites.attractions.map(a => ({...a, type: 'attraction'}))];

    if (allItems.length === 0) {
      favoritesContent.innerHTML = '<p class="favorites-empty">У вас пока нет избранных элементов</p>';
      return;
    }

    favoritesContent.innerHTML = allItems.map(item => {
      const isRoute = item.type === 'route';
      const removeClass = isRoute ? 'remove-favorite-route' : 'remove-favorite-attraction';
      const itemId = item.id;
      
      // Приводим путь к абсолютному, чтобы не ломался в подпапках
      let imagePath = item.image || 'assets/images/park.jpg';
      if (imagePath && !/^https?:\/\//i.test(imagePath) && !imagePath.startsWith('data:')) {
        try {
          imagePath = new URL(imagePath, window.location.href).href;
        } catch (e) {
          // оставляем как есть
        }
      }
      
      return `
        <div class="favorite-item">
          <div class="favorite-item__image" style="background-image: url('${imagePath}');"></div>
          <div class="favorite-item__content">
            <h3 class="favorite-item__title">${item.title || 'Без названия'}</h3>
            <p class="favorite-item__desc">${item.description || ''}</p>
            <button class="favorite-item__remove ${removeClass}" data-id="${itemId}" data-type="${item.type}">
              <i class="fas fa-trash"></i> Удалить из избранного
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Добавляем обработчики для кнопок удаления
    favoritesContent.querySelectorAll('.remove-favorite-route').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.dataset.id;
        favoritesManager.removeRoute(id);
        favoritesManager.updateFavoritesCount();
        updateFavoritesModal();
        // Обновляем кнопки избранного на странице
        document.querySelectorAll(`.favorite-btn-route[data-route-id="${id}"]`).forEach(btn => {
          btn.classList.remove('active');
          btn.querySelector('i').classList.remove('fas');
          btn.querySelector('i').classList.add('far');
        });
      });
    });

    favoritesContent.querySelectorAll('.remove-favorite-attraction').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.dataset.id;
        favoritesManager.removeAttraction(id);
        favoritesManager.updateFavoritesCount();
        updateFavoritesModal();
        // Обновляем кнопки избранного на странице
        document.querySelectorAll(`.favorite-btn-attraction[data-attraction-id="${id}"]`).forEach(btn => {
          btn.classList.remove('active');
          btn.querySelector('i').classList.remove('fas');
          btn.querySelector('i').classList.add('far');
        });
      });
    });
  }
});

