const routes = require('express').Router();

const utils = require("../utils");

const userUtils = require("../user");

const configManager = require("../configManager");

const fs = require('fs');

const videoManager = require("../videoManager");

routes.get('/', (request, result) =>
{
    var videoID = request.query.v;

    if(utils.checkPrivilege(request) >= utils.PRIVILEGE.MEMBER ||
        userUtils.isValidAPI(request.query.api) ||
        videoManager.isPublicVideo(videoID))
    {
        const rootDir = configManager.getRootDirectory();


        const path = rootDir + videoID;
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = request.headers.range;

        if (range)
        {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1;

            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path, {start, end});
            const head =
                {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                };
            result.writeHead(206, head);
            file.pipe(result);
        }
        else
        {
            const head =
                {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };

            result.writeHead(200, head);
            fs.createReadStream(path).pipe(result);
        }
    }
    else
    {
        utils.printError(result, "You need to be logged in");
    }
});

module.exports = routes;