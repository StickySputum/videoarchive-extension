// Contents of content.js
var currentUrl = window.location.href;

chrome.storage.local.get('savedUrls', function(data) {
    var savedUrls = data.savedUrls || [];

    // Добавляем новую ссылку в массив
    savedUrls.push(currentUrl);

    // Сохраняем обновленный массив в локальное хранилище
    chrome.storage.local.set({ 'savedUrls': savedUrls }, function() {
        console.log('Новая ссылка добавлена в локальное хранилище: ', currentUrl);
        // Уведомляем всплывающее окно об обновлении
        chrome.runtime.sendMessage({ action: "updatePopup", url: currentUrl });
    });
});
