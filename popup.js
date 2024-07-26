// Contents of popup.js
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем все сохраненные URL при открытии всплывающего окна
    chrome.storage.local.get('savedUrls', function(data) {
        var savedUrls = data.savedUrls || []; // Берем массив или инициализируем его
        var existingDiv = document.getElementById('urlListContainer');

        if (existingDiv) {
            // Очищаем контейнер перед обновлением
            existingDiv.innerHTML = '';

            if (savedUrls.length > 0) {
                savedUrls.forEach(function(url) {
                    // Создаем элемент для каждой сохраненной ссылки
                    var urlElement = document.createElement('div');
                    urlElement.textContent = url; // Добавляем текст ссылки
                    existingDiv.appendChild(urlElement); // Вставляем ссылку в контейнер
                });
            } else {
                existingDiv.textContent = "Сохраненные ссылки отсутствуют."; // Сообщение, если массив пуст
            }
        }
    });
    
    document.getElementById('AllVidsDownload').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "AllVidsDownload1" });
    });

    document.getElementById('addCurrentTabUrl').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "addCurrentTabUrl1" });
    });

    document.getElementById('clearStorage').addEventListener('click', function() {
        chrome.storage.local.remove('savedUrls', function() {
            var existingDiv = document.getElementById('urlListContainer');
            existingDiv.innerHTML = "Сохраненные ссылки очищены."; // Уведомление об очистке
        });
    });

    document.getElementById('DownloadList').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "DownloadList1" });
    });
});
