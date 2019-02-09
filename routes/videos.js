const routes = require('express').Router();

const utils = require("../utils");

const recursive = require('../recursiveTraversal');

const configManager = require("../configManager");

const filepreview = require('filepreview');

const fs = require('fs');

var privateVideos = null;

var publicVideos = null;

function getVideosForTemplate(templateContext, rootDir, templateKey, videos)
{
    if(videos === null)
    {
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
                    const icon = 'img/' + templateKey + '/' + name + ".png";
                    if (!fs.existsSync(icon))
                    {
                        filepreview.generate(file, icon, function(error) {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('File preview is located ' + icon);
                        });
                    }
                    videos.push({name: file.replace(rootDir, '')});
                });
                templateContext[templateKey] = videos;
                resolve();
            });
        })
    }
    else
    {
        templateContext[templateKey] = videos;
    }
}


function getVideosTemplateInformation(templateContext, request)
{
    var promises = [];

    const rootDir = configManager.getRootDirectory();

    const rootPublicDir = configManager.getPublicDirectory();

    if(utils.checkPrivilege(request) >= utils.PRIVILEGE.MEMBER)
    {
        promises.push(getVideosForTemplate(templateContext, rootDir, "private", privateVideos));
    }
    else
    {
        templateContext["private"] = [];
    }

    promises.push(getVideosForTemplate(templateContext, rootPublicDir, "public", publicVideos));

    return Promise.all(promises);
}

routes.get('/', (request, result) =>
{
    utils.renderHTML(request, result, "videos.html", getVideosTemplateInformation)
});

module.exports = routes;