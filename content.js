var currentUrl = window.location.href;

// Сохраняем URL в локальное хранилище (storage)
chrome.storage.local.set({ 'savedUrl': currentUrl }, function() {
  console.log('URL сохранен в локальное хранилище');
});

chrome.storage.local.get('savedUrl', function(data) {
    var savedUrl = data.savedUrl;
    
    if (savedUrl) {
      // Найти ваш существующий div, в который нужно вставить сохраненную ссылку
      var existingDiv = document.getElementById('yourExistingDivId');
      
      // Если div найден, вставляем сохраненную ссылку
      if (existingDiv) {
        existingDiv.innerHTML = "Сохраненная ссылка: " + savedUrl;
      }
    }
  });