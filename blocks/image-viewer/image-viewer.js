// Модальное окно для просмотра больших изображений
document.addEventListener('DOMContentLoaded', function() {
  // Универсальные стили для модалки просмотра изображений (чтобы фото не сжимались по высоте на мобильных)
  (function injectImageModalStyles() {
    if (document.getElementById('image-viewer-styles')) return;
    const style = document.createElement('style');
    style.id = 'image-viewer-styles';
    style.textContent = `
      .modal.modal-image-viewer {
        align-items: center;
        justify-content: center;
        padding: 10px;
      }

      .modal.modal-image-viewer[style*="block"] {
        display: flex !important;
      }

      .modal__content.modal__content--image {
        background: transparent !important;
        padding: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
        width: auto !important;
        height: auto !important;
        max-width: 95vw !important;
        max-height: 90vh !important;
        margin: 0 auto !important;
      }

      .modal-image-viewer__img {
        width: auto !important;
        height: auto !important;
        max-width: 95vw !important;
        max-height: 85vh !important;
        object-fit: contain !important;
      }

      @media (max-width: 767px) {
        .modal__content.modal__content--image {
          max-width: 100vw !important;
          max-height: 85vh !important;
        }

        .modal-image-viewer__img {
          max-width: 100vw !important;
          max-height: 75vh !important;
        }
      }
    `;
    document.head.appendChild(style);
  })();

  const imageModal = document.getElementById('modal-image-viewer');
  const imageModalImg = document.getElementById('modal-image-viewer-img');
  const imageModalClose = imageModal.querySelector('.modal__close');
  
  // Обработчики для открытия модального окна при клике на изображения ТОЛЬКО в галереях
  // Обрабатываем только изображения в галереях на страницах отдельных маршрутов/достопримечательностей
  document.querySelectorAll('.gallery-image img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      let imageSrc = '';
      
      if (this.src) {
        imageSrc = this.src;
      } else if (this.getAttribute('src')) {
        imageSrc = this.getAttribute('src');
      }
      
      if (imageSrc) {
        imageModalImg.src = imageSrc;
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Закрытие модального окна
  imageModalClose.addEventListener('click', function() {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
  });
  
  // Закрытие при клике вне изображения
  imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Закрытие при нажатии Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal.style.display === 'block') {
      imageModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
});

