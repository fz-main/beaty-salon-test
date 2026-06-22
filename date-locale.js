// Принудительно устанавливаем локаль cs для всех date inputs
document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('input[type="date"]');
  inputs.forEach(input => {
    input.setAttribute('lang', 'cs');
    // Для старых браузеров – используем Intl
    if (typeof input.showPicker === 'function') {
      // В новых браузерах lang обычно работает
    }
  });
});
