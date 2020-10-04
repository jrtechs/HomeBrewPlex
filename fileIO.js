
/** Used to read and write files from disk */
const fs = require('fs');

module.exports =
    {
        syncEnv: function()
        {
            const envVars = ["PORT", "SESSION_SECRET", "SERVER_URL", "PRIVATE_DIR", "PUBLIC_DIR"];
            const data = envVars.map(function(envVar) {
                return `${envVar}=${process.env[envVar]}`
            }).join("\r\n");
            fs.writeFile('.env', data, 'utf8', function() {
                console.log("Wrote to .env file");
            });
        },

        writEnvToFile: function(fileName, jsonObject)
        {
            const json = JSON.stringify(jsonObject, null, 4);
            fs.writeFile(fileName, json, 'utf8', function()
            {
                console.log("Wrote to " + fileName);
            });
        },


        /**
         *
         * @param fileName
         * @returns {any}
         */
        getFileAsJSON: function(fileName)
        {
            return JSON.parse(module.exports.getFile(fileName));
        },


        getFile: function(filename)
        {
            return fs.readFileSync(filename,  'utf8');
        }
    };
