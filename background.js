// Contents of background.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "addCurrentTabUrl1") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { file: 'content.js' });
        });
    } else if (message.action === "AllVidsDownload1") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { file: 'content1.js' });
        });
    } else if (message.action === "updatePopup") {
        // Сообщение для обновления всплывающего окна (если нужно что-то сделать)
        // Здесь можно выполнить дополнительные действия, если нужно
        console.log('Всплывающее окно обновлено');
    }
});
