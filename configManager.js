const fileIO = require('./fileIO');
const CONFIG_FILE_NAME = "conf.json";

const config = fileIO.getFileAsJSON(CONFIG_FILE_NAME);

module.exports=
    {
        getConfiguration: function()
        {
            return config;
        },

        syncToDisk: function()
        {
            fileIO.writeJSONToFile(CONFIG_FILE_NAME, config);
        },

        getRootDirectory: function()
        {
            return config.privateDir;
        },

        getPublicDirectory: function()
        {
            return config.publicDir;
        },

        getServerURL: function()
        {
            return config.serverURL;
        },

        updateSystem: function(host, publicDir, privateDir)
        {
            config.serverURL = host;
            config.privateDir = privateDir;
            config.publicDir = publicDir;

            module.exports.syncToDisk();
        },

        getUserCount: function()
        {
            return (config.hasOwnProperty('users')) ? config.users.length : 0;
        }



    };