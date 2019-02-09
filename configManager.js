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
            return "/home/jeff/public/Shows/Rick And Morty/Season 1";
        },

        getPublicDirectory: function()
        {
            return "/home/jeff/work/aaSchool/Algo/online Lectures/";
        },

        getServerURL: function()
        {
            return "http://localhost:5000";
        }

    };