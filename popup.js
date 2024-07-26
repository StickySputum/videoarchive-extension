// Contents of popup.js
document.addEventListener('DOMContentLoaded', function() {
    // Загрузите сохраненный URL в момент открытия всплывающего окна
    chrome.storage.local.get('savedUrl', function(data) {
        var savedUrl = data.savedUrl;
        var existingDiv = document.getElementById('urlListContainer');

        if (savedUrl && existingDiv) {
            existingDiv.innerHTML = "Сохраненная ссылка: " + savedUrl;
        } else if (!savedUrl && existingDiv) {
            existingDiv.innerHTML = "Сохраненная ссылка отсутствует.";
        }
    });
    
    document.getElementById('AllVidsDownload').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "AllVidsDownload1" });
    });

    document.getElementById('addCurrentTabUrl').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "addCurrentTabUrl1" });
    });

    document.getElementById('clearStorage').addEventListener('click', function() {
        chrome.storage.local.remove('savedUrl', function() {
            var existingDiv = document.getElementById('urlListContainer');
            existingDiv.innerHTML = "Сохраненная ссылка очищена."; // Уведомление об очистке
        });
    });

    document.getElementById('DownloadList').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "DownloadList1" });
    });
});
