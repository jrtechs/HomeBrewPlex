
/** Used to read and write files from disk */
const fs = require('fs');

module.exports =
    {
        writeJSONToFile: function(fileName, jsonObject)
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
            return JSON.parse(fs.readFileSync(fileName, 'utf8'));
        }
    };
