const configManager = require('./configManager');

const recursive = require('./recursiveTraversal');

const filepreview = require('filepreview');

const fs = require('fs');

var privateVideos = null;

var publicVideos = null;

function createIndex(filename, videos, templateKey)
{
    return new Promise(function(resolve, reject)
    {
        console.log("Generating icon for " + filename);
        var splitArray = filename.split('/');
        var name = splitArray[splitArray.length -1];
        const icon = './icon/' + templateKey + '/' + name + ".png";
        if (!fs.existsSync(icon))
        {
            var options = {
                width: 200,
                quality: 50,
                previewTime: '00:05:00.000'
            };

            filepreview.generate(filename, icon, options, function (error)
            {
                if (error)
                {
                    resolve();
                }
                console.log('File preview is located ' + icon);
                resolve();
            });
        }
        else
        {
            resolve();
        }
    })
}

async function runTasksSync(files, videos, templateKey)
{
    for(var file of files)
    {
        await createIndex(file, videos, templateKey);
    }
}



module.exports =
    {
        indexVideos: function(rootDir, videos, templateKey)
        {
            return new Promise(function(resolve, reject)
            {
                recursive(rootDir, function (err, files)
                {
                    files.forEach(file =>
                    {
                        videos.push({name: file.replace(rootDir, '')});
                    });
                    runTasksSync(files.splice(0, files.length/2), videos, templateKey);
                    runTasksSync(files.splice(files.length/2, files.length), videos, templateKey);
                    resolve();
                });
            }).catch(function(error)
            {
                //console.log(error);
            })
        },

        getVideosForTemplate: function(templateContext, templateKey)
        {
            return new Promise(function(resolve, reject)
            {
                var videos, rootDir;
                if(templateKey === "public")
                {
                    videos = publicVideos;
                    rootDir = configManager.getPublicDirectory();
                }
                else
                {
                    videos = privateVideos;
                    rootDir = configManager.getRootDirectory();
                }

                if(videos === null)
                {
                    videos = [];
                    module.exports.indexVideos(rootDir, videos, templateKey)
                        .then(function()
                    {
                        templateContext[templateKey] = videos;
                        if(templateKey === "public")
                            publicVideos = videos;
                        else
                            privateVideos = videos;
                        resolve();
                    })
                }
                else
                {
                    templateContext[templateKey] = videos;
                    resolve();
                }
            })
        },

        isPublicVideo: function(videoName)
        {
            if(publicVideos == null)
            {
                publicVideos = [];
                rootDir = configManager.getPublicDirectory();
                module.exports.indexVideos(rootDir, publicVideos, "public").then(function()
                {
                    for(var i = 0; i < publicVideos.length; i++)
                    {
                        const splitArray = publicVideos[i].name.split('/');
                        const name = splitArray[splitArray.length -1];

                        if(name === videoName)
                        {
                            return true;
                        }
                    }
                    return false;
                });
            }
            else
            {
                for(var i = 0; i < publicVideos.length; i++)
                {
                    const splitArray = publicVideos[i].name.split('/');
                    const name = splitArray[splitArray.length -1];

                    if(name === videoName)
                    {
                        return true;
                    }
                }
                return false;
            }
        },

        reIndexVideos: function()
        {
            publicVideos = [];
            privateVideos = [];
            module.exports.indexVideos(configManager.getPublicDirectory(), publicVideos, "public");
            module.exports.indexVideos(configManager.getRootDirectory(), privateVideos, "private");
        }
    };