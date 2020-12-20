# jeffery russell 12-19-2020

FROM node:buster-slim

WORKDIR /src/



COPY package.json package.json

RUN ls -la

# installs pandoc
RUN apt-get update && \
    apt-get install ffmpeg -y

# installs node dependencies
RUN npm install

# exposes port application runs on
EXPOSE 4000

# launch command
CMD npm start