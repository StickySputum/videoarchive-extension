import tkinter as tk
from tkinter import filedialog
import json
from pytube import YouTube
import threading
import os
from queue import Queue

class VideoDownloaderApp:
    def __init__(self):
        self.selected_file_path = ""
        self.save_directory = ""
        self.successful_downloads = 0
        self.total_videos = 0
        self.lock = threading.Lock()
        self.app = tk.Tk()
        self.app.title("Video Downloader")
        self.app.geometry("900x300")
        self.app.resizable(False, False)
        self.app.configure(bg='#222222')

        self.create_widgets()

    def create_widgets(self):
        self.output_text = tk.Text(self.app, height=8, wrap='word', bg='#333333', fg='#FFFFFF')
        self.output_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)

        scrollbar = tk.Scrollbar(self.app, width=20, command=self.output_text.yview)
        scrollbar.pack(side=tk.LEFT, fill=tk.Y)
        self.output_text.config(yscrollcommand=scrollbar.set)

        self.count_label = tk.Label(self.app, text="", bg='#222222', fg='#FFFFFF')
        self.count_label.pack()

        button_frame = tk.Frame(self.app, bg='#222222')
        button_frame.pack(side=tk.RIGHT, fill=tk.Y, padx=10)

        choose_dir_button = tk.Button(button_frame, text="Choose Save Directory", command=self.select_save_directory, bg='#555555', fg='#FFFFFF')
        choose_dir_button.pack(pady=10)

        choose_file_button = tk.Button(button_frame, text="Choose JSON File", command=self.select_file, bg='#555555', fg='#FFFFFF')
        choose_file_button.pack(pady=10)

        download_button = tk.Button(button_frame, text="Download Videos", command=self.download_videos, bg='#555555', fg='#FFFFFF')
        download_button.pack(pady=10)

        self.download_queue = Queue()

    def select_file(self):
        self.selected_file_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        if self.selected_file_path:
            self.output_text.insert(tk.END, "Selected File: " + os.path.basename(self.selected_file_path) + "\n")

    def select_save_directory(self):
        self.save_directory = filedialog.askdirectory()
        self.output_text.insert(tk.END, f"Selected Save Directory: {self.save_directory}\n")

    def download_video(self):
        while True:
            link, save_dir = self.download_queue.get()
            try:
                yt = YouTube(link)
                stream = yt.streams.get_highest_resolution()
                title = ''.join(c for c in yt.title if c.isalnum() or c in [' ', '.', '_', '-'])  # Очистка названия
                save_path = os.path.join(save_dir, title + '.mp4')
                stream.download(output_path=save_dir, filename=title + '.mp4')
                with self.lock:
                    self.successful_downloads += 1
                    self.output_text.insert(tk.END, f"Video from link {link} downloaded successfully\n")
                    if self.successful_downloads == self.total_videos:
                        self.output_text.insert(tk.END, "All videos have been downloaded!\n")
                    self.update_count_label()
            except Exception as e:
                self.output_text.insert(tk.END, f"Error downloading video from link {link}: {e}\n")
            finally:
                self.output_text.see(tk.END)
                self.download_queue.task_done()

    def update_count_label(self):
        self.count_label.config(text=f"Successful downloads: {self.successful_downloads}/{self.total_videos}")

    def download_videos(self):
        self.successful_downloads = 0
        video_links = []

        if not self.save_directory:
            self.output_text.insert(tk.END, "Choose the save directory first!\n")
            return

        if not self.selected_file_path:
            self.output_text.insert(tk.END, "Choose the JSON file first!\n")
            return

        with open(self.selected_file_path, 'r', encoding='utf-8') as file:
            video_links = json.load(file)

        self.total_videos = len(video_links)
        self.count_label.config(text=f"Successful downloads: {self.successful_downloads}/{self.total_videos}")

        for link in video_links:
            save_dir = os.path.join(self.save_directory, os.path.splitext(os.path.basename(self.selected_file_path))[0])
            if not os.path.exists(save_dir):
                os.makedirs(save_dir)
            self.download_queue.put((link, save_dir))

        # Start download threads
        for _ in range(min(3, len(video_links))):  # You can adjust the number of simultaneous downloads here
            t = threading.Thread(target=self.download_video)
            t.daemon = True
            t.start()

    def run(self):
        self.app.mainloop()

if __name__ == '__main__':
    app = VideoDownloaderApp()
    app.run()