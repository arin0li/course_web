// Пагинация для маршрутов
let routeCards = [];
let cardsPerPage = 4;
let currentPage = 1;
let totalPages = 1;

// Функция инициализации пагинации (вызывается из routes-script.js после создания карточек)
window.initPagination = function() {
  routeCards = Array.from(document.querySelectorAll('.route-card'));
  const pagination = document.querySelector('.pagination');
  if (!pagination || routeCards.length === 0) return;

  // Восстанавливаем страницу из sessionStorage
  const savedPage = parseInt(sessionStorage.getItem('routes_current_page'), 10);
  currentPage = Number.isFinite(savedPage) && savedPage >= 1 ? savedPage : 1;
  totalPages = Math.ceil(routeCards.length / cardsPerPage);

  showPage(currentPage);
};

function showPage(page) {
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  
  routeCards.forEach((card, index) => {
    if (index >= start && index < end) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });

  sessionStorage.setItem('routes_current_page', String(page));
  updatePaginationUI();
}

function updatePaginationUI() {
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;
  
  const numbersContainer = pagination.querySelector('.pagination__numbers');
  if (!numbersContainer) return;

  numbersContainer.innerHTML = '';
  
  // Показываем первую страницу
  if (totalPages > 0) {
    const firstPage = document.createElement('a');
    firstPage.href = '#';
    firstPage.className = `pagination__number ${currentPage === 1 ? 'pagination__number--active' : ''}`;
    firstPage.textContent = '1';
    firstPage.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = 1;
      showPage(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    numbersContainer.appendChild(firstPage);
  }

  // Показываем многоточие если нужно
  if (currentPage > 3 && totalPages > 5) {
    const dots = document.createElement('span');
    dots.className = 'pagination__dots';
    dots.textContent = '...';
    numbersContainer.appendChild(dots);
  }

  // Показываем страницы вокруг текущей
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (i === 1 || i === totalPages) continue;
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.className = `pagination__number ${currentPage === i ? 'pagination__number--active' : ''}`;
    pageLink.textContent = i;
    pageLink.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      showPage(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    numbersContainer.appendChild(pageLink);
  }

  // Показываем последнюю страницу
  if (totalPages > 1) {
    if (currentPage < totalPages - 2 && totalPages > 5) {
      const dots = document.createElement('span');
      dots.className = 'pagination__dots';
      dots.textContent = '...';
      numbersContainer.appendChild(dots);
    }

    const lastPage = document.createElement('a');
    lastPage.href = '#';
    lastPage.className = `pagination__number ${currentPage === totalPages ? 'pagination__number--active' : ''}`;
    lastPage.textContent = totalPages;
    lastPage.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = totalPages;
      showPage(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    numbersContainer.appendChild(lastPage);
  }

  // Обновляем стрелки
  const prevBtn = pagination.querySelector('.pagination__arrow--prev');
  const nextBtn = pagination.querySelector('.pagination__arrow--next');
  
  if (prevBtn) {
    prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
    prevBtn.style.pointerEvents = currentPage === 1 ? 'none' : 'auto';
    prevBtn.onclick = (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
  }

  if (nextBtn) {
    nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
    nextBtn.style.pointerEvents = currentPage === totalPages ? 'none' : 'auto';
    nextBtn.onclick = (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
  }
}

// Функция для обновления пагинации после фильтрации
window.updatePaginationAfterFilter = function() {
  const visibleCards = routeCards.filter(card => {
    const style = window.getComputedStyle(card);
    return style.display !== 'none';
  });
  const newTotalPages = Math.ceil(visibleCards.length / cardsPerPage) || 1;
  
  if (currentPage > newTotalPages) {
    currentPage = newTotalPages;
  }
  
  totalPages = newTotalPages;
  
  updatePaginationUI();
  
  // Показываем текущую страницу видимых карточек
  if (visibleCards.length > 0) {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    let visibleIndex = 0;
    
    routeCards.forEach((card) => {
      const style = window.getComputedStyle(card);
      if (style.display !== 'none') {
        if (visibleIndex >= start && visibleIndex < end) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
        visibleIndex++;
      }
    });
  }
};
