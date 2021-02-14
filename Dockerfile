# jeffery russell 12-19-2020

FROM node:buster-slim

WORKDIR /src/

COPY package.json package.json

RUN ls -la

# installs ffmpeg and gifski v 1.3.3
RUN apt-get update && \
    apt-get install ffmpeg -y && \
    apt-get install wget -y && \
    cd /root && \
    wget https://github.com/jrtechs/static-storage/raw/master/gifski.deb && \
    dpkg -i /root/gifski.deb && \
    rm /root/gifski.deb

# installs node dependencies
RUN npm install

# exposes port application runs on
EXPOSE 4000

# launch command
CMD npm start