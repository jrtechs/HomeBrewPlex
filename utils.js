const fileIO = require('./fileIO');


function fetchInTemplate(templateContext, templateKey, filename)
{
    templateContext[templateKey] = fileIO.getFile(filename);
}



const PRIVILEGE = {NOBODY: 0, MEMBER: 1, ADMIN: 2};

/** Template engine */
const whiskers = require('whiskers');

module.exports =
    {
        renderHTML: function(request, result, templateFile, templateDependencyFunction)
        {
            var templateContext = Object();
            var prom = [];

            prom.push(fileIO.getFile("./html/mainTemplate.html"));
            prom.push(fetchInTemplate(templateContext, "header", "./html/header.html"));
            prom.push(fetchInTemplate(templateContext, "footer", "./html/footer.html"));
            if(module.exports.checkPrivilege(request) >= PRIVILEGE.MEMBER)
            {
                templateContext.loggedIn = true;
                if(module.exports.checkPrivilege(request) === PRIVILEGE.ADMIN)
                    templateContext.admin = true;
            }
            else
            {
                prom.push(fetchInTemplate(templateContext, "login","./html/login.html"));
            }

            if(templateDependencyFunction !== null)
                prom.push(templateDependencyFunction(templateContext, request));
            prom.push(fetchInTemplate(templateContext, "main","./html/" + templateFile));

            Promise.all(prom).then(function(content)
            {
                result.write(whiskers.render(content[0], templateContext));
                result.end();
            });
        },

        PRIVILEGE:
        {
            NOBODY: 0,
            MEMBER: 1,
            ADMIN: 2
        },


        checkPrivilege: function(request)
        {
            if(request.session.login !== true)
                return module.exports.PRIVILEGE.NOBODY;
            else if(request.session.admin === true)
                return module.exports.PRIVILEGE.ADMIN;
            return module.exports.RIVILEGE.MEMBER;
        },

        printError: function(result, errorMessage)
        {
            var templateContext = Object();
            var prom = [];

            prom.push(fileIO.getFile("./html/mainTemplate.html"));
            prom.push(fetchInTemplate(templateContext, "header", "./html/header.html"));
            prom.push(fetchInTemplate(templateContext, "footer", "./html/footer.html"));
            prom.push(fetchInTemplate(templateContext, "main", "./html/error.html"));
            templateContext.errorMessage = errorMessage;

            Promise.all(prom).then(function(content)
            {
                result.write(whiskers.render(content[0], templateContext));
                result.end();
            });
        }
    };