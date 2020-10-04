const recursive = require('./recursiveTraversal');

const generatePreview = require('ffmpeg-generate-video-preview')

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
        const icon = 'icon/' + templateKey + '/' + name + ".gif";
        if (!fs.existsSync(icon))
        {
            var options =
                {
                    input: filename,
                    output: icon,
                    width: 128,
                    numFrames: 40
                };
            console.log(options);
            generatePreview(options).then(function(metaData)
            {
                console.log(metaData);
                resolve();
            }).catch(function(error)
            {
                resolve();
            })
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
                    if(files !== undefined)
                    {
                        files.forEach(file =>
                        {
                            videos.push({name: file.replace(rootDir, '')});
                        });
                        runTasksSync(files.splice(0, files.length/2), videos, templateKey);
                        runTasksSync(files.splice(files.length/2, files.length), videos, templateKey);
                        resolve();
                    }
                    else
                    {
                        resolve();
                    }
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
                    rootDir = process.env.PUBLIC_DIR
                }
                else
                {
                    videos = privateVideos;
                    rootDir = process.env.PRIVATE_DIR
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
                module.exports.indexVideos(process.env.PUBLIC_DIR, publicVideos, "public").then(function()
                {
                    for(var i = 0; i < publicVideos.length; i++)
                    {
                        const splitArray = publicVideos[i].name.split('/');
                        const name = splitArray[splitArray.length -1];
                        videoName = videoName.split('/').join("");
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

                    videoName = videoName.split('/').join("");
                    if(name + "" === videoName)
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
            module.exports.indexVideos(process.env.PUBLIC_DIR, publicVideos, "public");
            module.exports.indexVideos(process.env.PRIVATE_DIR, privateVideos, "private");
        },

        getPublicVideoCount: function()
        {
            return (publicVideos === null) ? 0: publicVideos.length;
        },

        getPrivateVideoCount: function()
        {
            return (privateVideos === null) ? 0: privateVideos.length;
        }
    };