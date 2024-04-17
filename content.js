chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "executeContentScript") {
        let finalUrl = message.finalUrl;
        if (window.location.href.includes('://en.savefrom.net/')) {
            // Флаг для отслеживания открытия ссылки
            let linkOpened = false;
            
            // Функция для проверки наличия элемента и выполнения необходимых действий
            function checkElementAndPerformAction() {
                var link = document.querySelector('.link-download');
                
                if (link && !linkOpened) {
                    var href = link.getAttribute('href');
                
                    if (href) {
                        console.log('Найден href ссылки: ' + href);
                        // Открываем ссылку только если она еще не была открыта
                        linkOpened = true;
                        window.close()
                        window.open(href, '_blank');
                        // Отправляем сообщение в фоновый скрипт с данными для отладки
                        chrome.runtime.sendMessage({
                            action: 'debugMessage',
                            message: 'Link opened successfully: ' + href
                        });
                    } else {
                        console.log('Ссылка не содержит атрибут href.');
                        chrome.runtime.sendMessage({
                            action: 'debugMessage',
                            message: 'Link is missing href attribute'
                        });
                    }
                } else {
                    console.log('Ссылка еще не загружена, ожидаем...');
                    chrome.runtime.sendMessage({
                        action: 'debugMessage',
                        message: 'Link is not loaded yet'
                    });
                }
            }
            
            // Создание нового MutationObserver и наблюдение за изменениями
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach(function(node) {
                            checkElementAndPerformAction();
                        });
                    }
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
        } 
    }
});