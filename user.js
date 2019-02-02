/** Crypto package used for hashing */
const crypto = require('crypto');

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
const getIndexOfUser = function(username, configuration)
{
    for(var i = 0; i < configuration.users.length; i++)
    {
        if (username === configuration.users[i].username)
        {
            if(username === configuration.users[i].username)
            {
                return i;
            }
        }
    }
    return -1;
};


module.exports =
    {
        /**
         * Checks to see if there was a valid login attempt
         *
         * @param username
         * @param password
         * @param configuration
         * @returns {boolean}
         */
        checkLogin: function(username, password, configuration)
        {
            const userIndex = getIndexOfUser(username, configuration);
            if(userIndex === -1)
                return false;

            const hashedPassword = hashPassword(password, configuration.users[userIndex].salt);
            return configuration.users[userIndex].password == hashedPassword;
        },

        /**
         * Adds a user to the configuration
         *
         * @param username
         * @param password
         * @param configuration
         * @returns {boolean}
         */
        addUser: function(username, password, configuration)
        {
            const userIndex = getIndexOfUser(username, configuration);
            if(userIndex !== -1)
                return false; // user already exists

            var newUser = new Object();
            newUser.username = username;

            if(configuration.users.length === 0)
                newUser.id = 1;
            else
                newUser.id = configuration.users[configuration.users.length -1].id + 1;

            const passObject = createHashedPasswordObject(password);
            newUser.salt = passObject.salt;
            newUser.password = passObject.pass;

            configuration.push(newUser);

            return true;
        },

        /**
         * Edits a user based on their id
         *
         * @param id
         * @param userName
         * @param password
         * @param configuration
         */
        editUser: function(id, userName, password, configuration)
        {
            for(var i = 0; i < configuration.users.length; i++)
            {
                if (configuration.users[i].id + "" === id)
                {
                    configuration.users[i].username = userName;

                    var passObj = createHashedPasswordObject(password);
                    configuration.users[i].salt = passObj.salt;
                    configuration.users[i].password = passObj.pass;
                }
            }
        },

        /**
         * Removes a user account from the configuration
         * @param id
         * @param configuration
         */
        removeUser: function(id, configuration)
        {
            configuration.users = configuration.users.filter(function(value, index, arr)
            {
                return value.id + "" !== id
            });
        }
    };
