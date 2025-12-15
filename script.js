
  document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // ФОРМА ОБРАТНОЙ СВЯЗИ
    // ============================================
    const form = document.getElementById('contactForm');
    const btn = document.querySelector('.contact-card__btn');

    if (form && btn) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        btn.textContent = 'Отправлено!';
        btn.style.background = 'linear-gradient(180deg, #66BB6A, #4CAF50)';

        setTimeout(() => {
          alert('Спасибо! Ваш отзыв отправлен. Мы очень ценим ваше мнение о природе Приднестровья!');
          form.reset();
          btn.textContent = 'Отправить';
          btn.style.background = 'linear-gradient(180deg, #4B99B2, #6ADB90)';
        }, 800);
      });
    }

    // ============================================
    // КНОПКА "НАВЕРХ" С АНИМАЦИЕЙ
    // ============================================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Наверх');
    document.body.appendChild(backToTopBtn);

    // Показать/скрыть кнопку при скролле
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    // Плавный скролл наверх
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // ============================================
    // АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
    // ============================================
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Наблюдаем за элементами
    document.querySelectorAll('.attraction-card, .routes-card, .tip-item, .rule-item, .about__bg, .contact-card').forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  });
