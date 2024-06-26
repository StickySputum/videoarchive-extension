chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "executeContentScript") {
        let finalUrl = message.finalUrl;
        if (window.location.href.includes('://en.savefrom.net/')) {
            let linkOpened = false;

            function checkElementAndPerformAction() {
                let link = document.querySelector('.link-download');

                if (link && !linkOpened) {
                    let href = link.getAttribute('href');

                    if (href) {
                        console.log('Найден href ссылки: ' + href);
                        linkOpened = true;
                        console.log(finalUrl);
                        window.open(href); // Меняем текущую вкладку на скачивание файла
                        window.close();
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

            let observer = new MutationObserver(function(mutations) {
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