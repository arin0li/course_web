
// Карта + слайдер с карточками, которые заходят на карту
document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([46.95, 29.35], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  let clickCount = 0;
  let lastClickedCard = null;

  document.querySelectorAll('.slider-card').forEach(card => {
    const lat = card.dataset.lat;
    const lng = card.dataset.lng;
    const url = card.dataset.url;
    const title = card.querySelector('.slider-card__title').textContent;

    const marker = L.marker([lat, lng]).addTo(map)
      .bindPopup(`<b>${title}</b>`);

    card.addEventListener('click', () => {
      clickCount++;

      // Убираем активность
      document.querySelectorAll('.slider-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      map.flyTo([lat, lng], 13, { duration: 1.2 });

      if (clickCount === 2 && lastClickedCard === card) {
        setTimeout(() => location.href = url, 500);
      } else {
        lastClickedCard = card;
        setTimeout(() => clickCount = 0, 600);
      }
    });
  });

  // Стрелки прокрутки
  document.querySelector('.slider-btn.prev').addEventListener('click', () => {
    document.querySelector('.slider-track').scrollBy({ left: -373, behavior: 'smooth' });
  });
  document.querySelector('.slider-btn.next').addEventListener('click', () => {
    document.querySelector('.slider-track').scrollBy({ left: 373, behavior: 'smooth' });
  });
});
