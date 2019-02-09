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
                // console.log(config);
                // console.log("Config Updated");
        }

};