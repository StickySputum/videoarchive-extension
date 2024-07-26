alert("Бля")
// contents of content.js
var currentUrl = window.location.href;

// Сохраняем URL в локальное хранилище (storage)
chrome.storage.local.set({ 'savedUrl': currentUrl }, function() {
  console.log('URL сохранен в локальное хранилище: ', currentUrl);
  // Отправляем сообщение в фоновый скрипт, чтобы обновить всплывающее окно
  chrome.runtime.sendMessage({ action: "updatePopup" });
});
