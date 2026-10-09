// Script for modal windows
function setupModal(triggerId, modalId, closeId) {
  const trigger = document.getElementById(triggerId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeId);

  if (!trigger || !modal || !closeBtn) return;

  trigger.addEventListener('click', function(e) {
	e.preventDefault();
	modal.style.display = 'block';
	document.body.style.overflow = 'hidden'; /* Блокируем прокрутку сайта на фоне */
  });

  const closeModal = function() {
	modal.style.display = 'none';
	document.body.style.overflow = ''; /* Возвращаем прокрутку сайту */
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
	if (e.target === modal) closeModal();
  });
}

// Инициализируем оба окна
setupModal('open-privacy', 'privacy-modal', 'close-privacy');
setupModal('open-terms', 'terms-modal', 'close-terms');

// Находим все ссылки внутри нашего выпадающего меню
document.querySelectorAll('.menu-links a').forEach(link => {
	// При клике на любую ссылку находим чекбокс и снимаем галочку (false)
	link.addEventListener('click', () => {
	  document.getElementById('burger-toggle').checked = false;
	});
});
