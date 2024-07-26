// Contents of content.js
var currentUrl = window.location.href;

// Получаем текущий массив сохраненных URL из локального хранилища
chrome.storage.local.get('savedUrls', function(data) {
    var savedUrls = data.savedUrls || []; // Если массив не существует, инициализируем его

    // Добавляем новую ссылку в массив
    savedUrls.push(currentUrl);

    // Сохраняем обновленный массив в локальное хранилище
    chrome.storage.local.set({ 'savedUrls': savedUrls }, function() {
        console.log('Новая ссылка добавлена в локальное хранилище: ', currentUrl);
        // После сохранения обновляем всплывающее окно
        chrome.runtime.sendMessage({ action: "updatePopup" });
    });
});
