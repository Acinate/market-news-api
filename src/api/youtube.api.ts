import { YoutubeFile } from "./../data/youtube/youtube-file.data";
import { YoutubeParser } from "./../data/youtube/youtube-parser.data";
import { YoutubeScanner } from "./../data/youtube/youtube-scanner.data";
import { YoutubeChannel } from "./../models/youtube/youtube-channel.model";
import { YoutubeVideo } from "./../models/youtube/youtube-video.model";
import { Thread } from "./../tools/thread";

export class YoutubeApi {
  private youtubeScanner: YoutubeScanner;
  private youtubeParser: YoutubeParser;
  private youtubeFile: YoutubeFile;
  private thread: Thread;

  constructor() {
    this.youtubeScanner = new YoutubeScanner();
    this.youtubeParser = new YoutubeParser();
    this.youtubeFile = new YoutubeFile();
    this.thread = new Thread();
  }

  /* Scans Youtube Channels and writes results to file */
  public async autoScan(): Promise<void> {
    while (true) {
      this.youtubeScanner
        .scanChannels()
        .then((channels: Array<YoutubeChannel>) => {
          // merge channels
          this.youtubeParser
            .mergeVideos(channels, 10)
            .then((videos: Array<YoutubeVideo>) => {
              // write videos to file
              this.youtubeFile.writeYoutubeVideosToFile(videos);
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
      // Sleep for 600 seconds (10 minutes)
      await this.thread.sleep(600000);
    }
  }
}
