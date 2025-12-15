// Модальные окна для советов (Правила поведения на природе и Безопасность)
document.addEventListener('DOMContentLoaded', function() {
  // Обработчики для открытия модальных окон при клике на tip-card__header
  document.querySelectorAll('.tip-card__header[data-modal]').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById('modal-' + modalId);
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Закрытие модальных окон для советов
  document.querySelectorAll('#modal-nature-rules, #modal-safety').forEach(modal => {
    const closeBtn = modal.querySelector('.modal__close');
    
    // Закрытие по кнопке
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
    
    // Закрытие при клике вне модального окна
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });

  // Закрытие при нажатии Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('#modal-nature-rules, #modal-safety').forEach(modal => {
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }
  });
});

