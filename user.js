/** Crypto package used for hashing */
const crypto = require('crypto');


const configManager = require("./configManager");

var users = configManager.getConfiguration().users;


/**
 * Helper function to generate a hashed password
 * from a given plain text password.
 *
 * This uses 64 bits of entropy as the random salt
 * and uses sha256 hashing method to hash the password
 * combined with the salt.
 *
 * @param password
 * @returns {Object pass: hashedPassword, salt: salt used to hash}
 */
const createHashedPasswordObject = function(password)
{
    const randBuff = crypto.randomBytes(64);

    const salt = crypto.createHash('sha256').update(randBuff).digest('hex');

    const hashPass = hashPassword(password, salt);

    var hashPassObject = new Object();
    hashPassObject.pass = hashPass;
    hashPassObject.salt = salt;
    return hashPassObject;
};


const generateRandomAPIKey = function()
{
    const randBuff = crypto.randomBytes(64);
    return crypto.createHash('sha256').update(randBuff).digest('hex');
};


/**
 * Hashes a pasword with a aprticular salt
 * using the crypto library
 *
 * @param password
 * @param salt
 */
const hashPassword = function(password, salt)
{
    return crypto.createHash('sha256')
        .update(password + salt)
        .digest('hex');
};

/**
 * Fetches the index of the user in the configuration. If the
 * user does not exists a -1 is returned.
 */
const getIndexOfUser = function(username)
{
    for(var i = 0; i < users.length; i++)
    {
        if (username === users[i].username)
        {
            if(username === users[i].username)
            {
                return i;
            }
        }
    }
    return -1;
};


module.exports =
    {

        isValidAPI: function(apiKey)
        {
            for(var i = 0; i < users.length; i++)
            {
                if(users[i].api === apiKey)
                {
                    return true;
                }
            }
            return false;
        },

        isAdmin: function(username)
        {
            var index = getIndexOfUser(username);

            if(index !== -1)
            {
                return users[index].admin;
            }
            return false;
        },


        getID: function(username)
        {
            var index = getIndexOfUser(username);
            return users[index].id;
        },


        revokeAPI: function(username)
        {
            var index = getIndexOfUser(username);

            if(index !== -1)
            {
                users[index].api = generateRandomAPIKey();
            }
            configManager.syncToDisk();
        },


        getAPIKEY: function(username)
        {
            var index = getIndexOfUser(username);
            if(index !== -1)
                return users[index].api;
            return 0;
        },

        /**
         * Checks to see if there was a valid login attempt
         *
         * @param username
         * @param password
         * @returns {boolean}
         */
        checkLogin: function(username, password)
        {
            const userIndex = getIndexOfUser(username);
            if(userIndex === -1)
                return false;

            const hashedPassword = hashPassword(password, users[userIndex].salt);
            return users[userIndex].password == hashedPassword;
        },


        /**
         * Adds a user to the configuration
         *
         * @param username
         * @param password
         * @returns {boolean}
         */
        addUser: function(username, password, admin)
        {
            const userIndex = getIndexOfUser(username);
            if(userIndex !== -1)
                return false; // user already exists

            var newUser = new Object();
            newUser.username = username;
            newUser.api = generateRandomAPIKey();
            if(users.length === 0)
                newUser.id = 1;
            else
                newUser.id = users[users.length -1].id + 1;

            const passObject = createHashedPasswordObject(password);
            newUser.salt = passObject.salt;
            newUser.password = passObject.pass;
            newUser.admin = admin;
            users.push(newUser);
            configManager.syncToDisk();

            return true;
        },


        /**
         * Edits a user based on their id
         *
         * @param id
         * @param userName
         * @param password
         */
        editUser: function(id, userName, password, admin)
        {
            for(var i = 0; i < users.length; i++)
            {
                if (users[i].id=== id)
                {
                    console.log("User account updated.");
                    users[i].username = userName;
                    users[i].admin = admin;

                    var passObj = createHashedPasswordObject(password);
                    users[i].salt = passObj.salt;
                    users[i].password = passObj.pass;
                }
            }

            configManager.syncToDisk();
        },


        /**
         * Removes a user account from the configuration
         * @param id
         */
        removeUser: function(id)
        {
            users = users.filter(function(value, index, arr)
            {
                return value.id + "" !== id
            });

            configManager.syncToDisk();
        }
    };
