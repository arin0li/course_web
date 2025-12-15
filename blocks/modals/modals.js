// Управление модальными окнами
document.addEventListener('DOMContentLoaded', function() {
  // Открытие модальных окон по клику на кнопки (кроме tip-card__header и кнопок "Подробнее", которые обрабатываются в tips-modals.js)
  document.querySelectorAll('[data-modal]').forEach(btn => {
    // Исключаем tip-card__header и кнопки "Подробнее" (routes-card__btn и attraction-card__btn)
    if (!btn.classList.contains('tip-card__header') && 
        !btn.classList.contains('routes-card__btn') && 
        !btn.classList.contains('attraction-card__btn')) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById('modal-' + modalId);
        if (modal) {
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden';
        }
      });
    }
  });

  // Закрытие модальных окон
  document.querySelectorAll('.modal__close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Закрытие при клике вне модального окна
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      // Закрываем только если клик был по фону модального окна (не по содержимому)
      if (e.target === this) {
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
    }
  });
});

