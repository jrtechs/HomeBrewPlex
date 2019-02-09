const routes = require('express').Router();

const utils = require("../utils");

const recursive = require('../recursiveTraversal');

const configManager = require("../configManager");

const filepreview = require('filepreview');

const fs = require('fs');

var videos = null;

function getVideosTemplateInformation(templateContext, request)
{
    if(videos === null)
    {
        const rootDir = configManager.getRootDirectory();
        videos = [];
        return new Promise(function(resolve, reject)
        {
            recursive(rootDir, function (err, files)
            {
                console.log(files);
                files.forEach(file =>
                {
                    var splitArray = file.split('/');
                    var name = splitArray[splitArray.length -1];
                    const icon = 'img/private/' + name + ".png";
                    if (!fs.existsSync(icon))
                    {
                        filepreview.generate(file, icon, function(error) {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('File preview is located ' + icon);
                        });
                    }
                    videos.push({name: file.replace(rootDir, ''), length: "n/a"});
                });
                templateContext.videos = videos;
                resolve();
            });
        })
    }
    else
    {
        templateContext.videos = videos;
    }
}

routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "videos.html", getVideosTemplateInformation)
});

module.exports = routes;