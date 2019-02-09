const routes = require('express').Router();

const utils = require("../utils");

const fs = require('fs');

const videoManager = require('../videoManager');

function isPublicVideo(videoURL)
{
    return false;
}

routes.get('/', (request, result) =>
{
    try
    {
        const videoID = request.query.v;

        const splitArray = videoID.split('/');
        const name = splitArray[splitArray.length -1] + ".png";

        var file="";

        if(!videoManager.isPublicVideo(videoID))
        {
            if(utils.checkPrivilege(request) >= utils.PRIVILEGE.MEMBER)
            {
                file = fs.readFileSync("./icon/private/" + name);
            }
            else
            {
                utils.printError(result, "You need to be logged in");
                throw "Not logged in";
            }
        }
        else
        {
            file = fs.readFileSync("./icon/public/" + name);
        }

        result.writeHead(200, {'Content-Type': 'image/png',
            'Vary': 'Accept-Encoding'});
        result.write(file);
        result.end();
    }
    catch(error)
    {
        utils.printError(result, "Invalid Icon");
    }
});

module.exports = routes;