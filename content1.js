if (window.location.href.includes("/videos")) {
    let youtubeUrl = 'https://www.youtube.com';
    let videoLinks = [];

    if (localStorage.getItem('executeAfterReload')) {
        localStorage.removeItem('executeAfterReload');

        // Извлекаем название канала из URL
        let channelName = window.location.href.split('@')[1].split('/videos')[0];

        let videoElements = document.querySelectorAll('#video-title-link');

        videoElements.forEach(function(videoElement) {
            let videoHref = videoElement.getAttribute('href');

            if (videoHref) {
                let fullVideoUrl = youtubeUrl + videoHref;
                videoLinks.push(fullVideoUrl);
            }
        });

        let jsonVideoLinks = JSON.stringify(videoLinks);

        let blob = new Blob([jsonVideoLinks], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.download = `${channelName}.json`; // Используем название канала для названия файла
        a.click();

        URL.revokeObjectURL(url);
        chrome.runtime.sendMessage({ action: "DownloadList" });
    } else {
        localStorage.setItem('executeAfterReload', 'true');
        alert("После перезагрузки пролистайте все видео до конца и нажмите на расширение заново");
        location.reload();
    }
} else {
    alert("Это не канал ютуб")
}