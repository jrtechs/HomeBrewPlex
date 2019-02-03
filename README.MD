# What Is This?

This is a custom media server written in node JS to stream videos from a remote server.
This web system enables users to log into the system and view videos using the basic HTML 5 video player.

# Why?
- Universal and will run on any device with a web browser
- Supports buffering which is useful when connecting to a remote server
- Gained security because you don't need to grant everyone user accounts to view content from media server

# Why just not use Plex?
- Light weight
- Easy to install
- Easily expandable and hackable to fit your needs



npm dependencies
```bash
npm install express --save
npm install fs --save
npm install express-session --save
npm install whiskers --save
```


Codacs which don't work
H.265 
MPEG-2 Video  AC-3 (ATSC A/52)

Video but no audio
H.264 audio:AC-3 (ATSC A/52)
H.264 (Main Profile)  AC-3 (ATSC A/52)

Audio but no video:
H.265 (Main 10 Profile)  MPEG-4 AAC


just work:
H.264 (High Profile),   MPEG-4 AAC
