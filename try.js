chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      var urlToDuplicate = activeTab.url;
  
      if (urlToDuplicate.includes("youtube.com/watch")) {
        // Формируем новую ссылку с добавлением "ss" после "www."
        var newUrl = urlToDuplicate.replace("www.", "www.ss");
  
        // Открываем новую вкладку с новой сформированной ссылкой
        chrome.tabs.create({ url: newUrl });
      } else if (urlToDuplicate.includes("youtube.com/@")) {
        // Выполните действия для youtube.com
        alert("This is YouTube channel");
      }
    });
  });