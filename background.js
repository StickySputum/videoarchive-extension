chrome.browserAction.onClicked.addListener(function(tab) {
    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let activeTab = tabs[0];
        let urlToDuplicate = activeTab.url;

        if (urlToDuplicate.includes("youtube.com/watch")) {
            // Формируем новую ссылку с добавлением "ss" после "www."
            let newUrl = urlToDuplicate.replace("www.", "www.ss");

            // Создаем новую вкладку с новой сформированной ссылкой
            chrome.tabs.create({ url: newUrl }, function(newTab) {
                chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
                    if (tabId === newTab.id && changeInfo.status === 'complete') {
                        // Получаем окончательное значение URL только что открытой вкладки
                        let finalUrl = updatedTab.url;
                        console.log("Окончательный URL вкладки: " + finalUrl);

                        // Выполняем контент-скрипт на только что открытой вкладке
                        chrome.tabs.sendMessage(newTab.id, { action: "executeContentScript", finalUrl: finalUrl });

                        // Удаляем обработчик события, чтобы избежать повторного вызова
                        chrome.tabs.onUpdated.removeListener(listener);
                    }
                });
            });
        } else if (urlToDuplicate.includes("youtube.com/@")) {
            // Выполните действия для youtube.com
            alert("This is YouTube channel");
        }
    });
});chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "debugMessage") {
        console.log('[Debug message from content.js]: ' + message.message);
    }
});
