// Быстрый просмотр для маршрутов и достопримечательностей
document.addEventListener('DOMContentLoaded', function() {
  // Обработчики для "Быстрый просмотр" на достопримечательностях
  document.querySelectorAll('.attraction-card .routes-card__quick').forEach(quickBtn => {
    quickBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.attraction-card');
      if (card) {
        // Определяем, какая это достопримечательность
        let modalId = null;
        if (card.classList.contains('card-yagorlyk')) {
          modalId = 'attraction-yagorlyk';
        } else if (card.classList.contains('card-grape')) {
          modalId = 'attraction-vineyards';
        } else if (card.classList.contains('card-park')) {
          modalId = 'attraction-rodina';
        }

        if (modalId) {
          const modal = document.getElementById('modal-' + modalId);
          if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
          }
        }
      }
    });
  });

  // Обработчики для "Быстрый просмотр" на маршрутах
  document.querySelectorAll('.routes-card .routes-card__quick').forEach(quickBtn => {
    quickBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.routes-card');
      if (card) {
        // Определяем, какой это маршрут
        let modalId = null;
        if (card.classList.contains('card-kamenka')) {
          modalId = 'route-kamenka';
        } else if (card.classList.contains('card-bender')) {
          modalId = 'route-bender';
        } else if (card.classList.contains('card-turunchuck')) {
          modalId = 'route-turunchuck';
        }

        if (modalId) {
          const modal = document.getElementById('modal-' + modalId);
          if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
          }
        }
      }
    });
  });
});

