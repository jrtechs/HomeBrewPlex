const routes = require('express').Router();

const utils = require("../utils");

const fs = require('fs');

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

        console.log(name);

        var file="";

        if(!isPublicVideo(videoID))
        {
            if(utils.checkPrivilege(request) >= utils.PRIVILEGE.MEMBER)
            {
                file = fs.readFileSync("./img/private/" + name);
            }
            else
            {
                throw "Not logged in";
            }
        }
        else
        {
            file = fs.readFileSync("./img/public/" + name);
        }

        result.writeHead(200, {'Content-Type': 'image/png',
            'Vary': 'Accept-Encoding'});
        result.write(file);
        result.end();
    }
    catch(error)
    {
        result.writeHead(404, {'Content-Type': 'text/html',
            'Vary': 'Accept-Encoding'});
        result.write("Nada");
        result.end();
    }
});

module.exports = routes;