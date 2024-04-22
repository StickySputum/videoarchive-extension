from PySide2.QtWidgets import *
from PySide2.QtCore import Qt, QSettings
import json
from pytube import YouTube
import threading
import os
from queue import Queue
import sys
import re

class VideoDownloaderApp(QMainWindow):
    def __init__(self):
        super().__init__()

        self.selected_file_path = ""
        self.settings = QSettings("VideoDownloaderApp", "settings")
        self.save_directory = self.settings.value("save_directory", "", type=str)
        self.successful_downloads = 0
        self.total_videos = 0
        self.lock = threading.Lock()
        self.download_queue = Queue()

        self.setWindowTitle("Video Downloader")
        self.setGeometry(100, 100, 900, 300)
        self.setStyleSheet("background-color: #222222; color: #FFFFFF;")

        self.create_widgets()

    def create_widgets(self):
        self.output_text = QTextEdit(self)
        self.output_text.setGeometry(10, 10, 500, 250)

        self.progress_bar = QProgressBar(self)
        self.progress_bar.setGeometry(520, 70, 160, 20)

        choose_dir_button = QPushButton("Choose Save Directory", self)
        choose_dir_button.setGeometry(520, 100, 160, 30)
        choose_dir_button.setStyleSheet("background-color: #555555; color: #FFFFFF;")
        choose_dir_button.clicked.connect(self.select_save_directory)

        choose_file_button = QPushButton("Choose JSON File", self)
        choose_file_button.setGeometry(520, 140, 160, 30)
        choose_file_button.setStyleSheet("background-color: #555555; color: #FFFFFF;")
        choose_file_button.clicked.connect(self.select_file)

        download_button = QPushButton("Download Videos", self)
        download_button.setGeometry(520, 180, 160, 30)
        download_button.setStyleSheet("background-color: #555555; color: #FFFFFF;")
        download_button.clicked.connect(self.download_videos)

    def select_file(self):
        self.selected_file_path, _ = QFileDialog.getOpenFileName(self, "Choose JSON File", "", "JSON files (*.json)")
        if self.selected_file_path:
            self.output_text.append("Selected File: " + os.path.basename(self.selected_file_path))

    def select_save_directory(self):
        new_save_directory = QFileDialog.getExistingDirectory(self, "Choose Save Directory", self.save_directory)
        if new_save_directory:
            self.save_directory = new_save_directory
            self.settings.setValue("save_directory", self.save_directory)
            self.output_text.append(f"Selected Save Directory: {self.save_directory}")

    def download_video(self):
        while True:
            link, save_dir = self.download_queue.get()
            try:
                yt = YouTube(link)
                stream = yt.streams.get_highest_resolution()
                title = yt.title

                # Удаляем или заменяем недопустимые символы для Windows в названии файла
                title_clean = re.sub(r'[<>:"/\\|?*]', '_', title)
                save_path = os.path.join(save_dir, f"{title_clean}" + '.mp4')
                stream.download(output_path=save_dir, filename=title_clean + '.mp4')

                with self.lock:
                    self.successful_downloads += 1
                    self.update_progress_bar()
                    self.output_text.append(f"Video from link {link} downloaded successfully")
                    if self.successful_downloads == self.total_videos:
                        self.output_text.append("All videos have been downloaded!")
            except Exception as e:
                self.output_text.append(f"Error downloading video from link {link}: {e}")
                self.successful_downloads += 1
            finally:
                self.download_queue.task_done()

    def update_progress_bar(self):
        progress = int((self.successful_downloads / self.total_videos) * 100)
        self.progress_bar.setValue(progress)

    def download_videos(self):
        self.successful_downloads = 0
        video_links = []

        if not self.save_directory:
            self.output_text.append("Choose the save directory first!")
            return

        if not self.selected_file_path:
            self.output_text.append("Choose the JSON file first!")
            return

        with open(self.selected_file_path, 'r', encoding='utf-8') as file:
            video_links = json.load(file)

        self.total_videos = len(video_links)

        for link in video_links:
            save_dir = os.path.join(self.save_directory, os.path.splitext(os.path.basename(self.selected_file_path))[0])
            if not os.path.exists(save_dir):
                os.makedirs(save_dir)
            self.download_queue.put((link, save_dir))

        # Start download threads
        for _ in range(min(1, len(video_links))):
            t = threading.Thread(target=self.download_video)
            t.daemon = True
            t.start()

    def run(self):
        self.show()

if __name__ == '__main__':
    app = QApplication([])
    downloader_app = VideoDownloaderApp()
    downloader_app.run()
    sys.exit(app.exec_())