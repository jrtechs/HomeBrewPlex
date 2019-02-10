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

# Installation

## NPM Dependencies

```bash
npm install
```

## System Dependencies

```bash
$apt-get install ffmpeg
```

This also relies on [gifski](https://gif.ski/) which can be installed following the links on their website.
Both ffmpeg and gifski are used for generating the video preview gifs. 

## Running

To deploy this you will want to run this behind a reverse NGINX proxy to
allow you to encrypt all of the network traffic.
There are plenty of tutorials on how to do this online with let's encrypt.

To run this program either run `run.sh` or execute `node server.js`. This
by default will run on port 5000 -- you are able to change this in `conf.json`.
To make this easier for you in the long run, I usually run my node applications
as [systemd](https://freedesktop.org/wiki/Software/systemd/) services. 

The default config provided in this project has the default username of admin and password
of admin. 
You will want create a new admin user and remove the default one once you 
get this running.

# Contributing

This was largely just a weekend hack for me.
This currently fits most of my needs and is *functional*.
If you find any bugs, feel free to open a issue and I will get around to looking at it. 
I am always looking for people to contribute to my projects.
If you have an idea for an enhancement for this project feel free to hack away and issue a PR.
Contact me using the form on my [blog](jrtechs.net) or by opening a github issue if you have any questions regarding the code or how to use this project.
