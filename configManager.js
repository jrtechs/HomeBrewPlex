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

        updateSystem: function(host, publicDir, privateDir)
        {
            process.env.SERVER_URL = host;
            process.env.PRIVATE_DIR = privateDir;
            process.env.PUBLIC_DIR = publicDir;

            fileIO.syncEnv();
        },

        getUserCount: function()
        {
            return (config.hasOwnProperty('users')) ? config.users.length : 0;
        }
    };