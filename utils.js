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
            if(checkPrivilege(request) >= PRIVILEGE.MEMBER)
            {
                templateContext.loggedIn = true;
                if(checkPrivilege(request) === PRIVILEGE.ADMIN)
                    templateContext.admin = true;
                if(templateDependencyFunction !== null)
                    prom.push(templateDependencyFunction(templateContext, request));
                prom.push(fetchInTemplate(templateContext, "main","./html/" + templateFile));
            }
            else
            {
                prom.push(fetchInTemplate(templateContext, "login","./html/login.html"));
            }

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
        }
    };