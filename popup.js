// Contents of popup.js
document.addEventListener('DOMContentLoaded', function() {
    loadSavedUrls();

    document.getElementById('AllVidsDownload').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "AllVidsDownload1" });
    });

    document.getElementById('addCurrentTabUrl').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "addCurrentTabUrl1" });
    });

    document.getElementById('clearStorage').addEventListener('click', function() {
        chrome.storage.local.remove('savedUrls', function() {
            var existingDiv = document.getElementById('urlListContainer');
            existingDiv.innerHTML = "";
        });
    });

    document.getElementById('DownloadList').addEventListener('click', function() {
        downloadList(); // Добавить вызов функции скачивания списка
    });

    // Обработчик для обновления списка ссылок при получении сообщения
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "updatePopup") {
            addUrlToList(request.url); // Добавляем новую ссылку в список
        }
    });
});

// Функция для загрузки и отображения сохраненных ссылок
function loadSavedUrls() {
    chrome.storage.local.get('savedUrls', function(data) {
        var savedUrls = data.savedUrls || [];
        var existingDiv = document.getElementById('urlListContainer');
        existingDiv.innerHTML = '';
        
        if (savedUrls.length > 0) {
            savedUrls.forEach(function(url) {
                addUrlToList(url);
            });
        } else {
            
        }
    });
}

// Функция для добавления новой ссылки в список
function addUrlToList(url) {
    var existingDiv = document.getElementById('urlListContainer');
    var urlElement = document.createElement('div');
    urlElement.textContent = url; // Добавляем текст ссылки
    existingDiv.appendChild(urlElement); // Вставляем ссылку в контейнер
}

// Функция для скачивания списка ссылок как JSON
function downloadList() {
    chrome.storage.local.get('savedUrls', function(data) {
        var savedUrls = data.savedUrls || [];
        var jsonVideoLinks = JSON.stringify(savedUrls, null, 2); // Преобразуем массив в JSON

        var blob = new Blob([jsonVideoLinks], { type: "application/json" });
        var url = URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.download = "savedUrls.json"; // Имя файла
        a.click();

        URL.revokeObjectURL(url); // Освобождаем созданный объект URL
    });
}
