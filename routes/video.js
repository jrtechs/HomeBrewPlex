const routes = require('express').Router();

const utils = require("../utils");

const userUtils = require("../user");

const configManager = require("../configManager");

const fs = require('fs');

routes.get('/', (request, result) =>
{
    if(utils.checkPrivilege(request) >= utils.PRIVILEGE.MEMBER ||
        userUtils.isValidAPI(request.query.api))
    {
        const rootDir = configManager.getRootDirectory();

        var videoID = request.query.v;
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
        console.log("invalid attempt to view video");
        result.status(401);
        result.send('None shall pass');
    }
});

module.exports = routes;