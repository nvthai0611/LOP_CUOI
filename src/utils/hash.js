const bcrypt = require('bcryptjs');
module.exports = {
    hashMake: async (password) => {
        return bcrypt.hash(password, 10);
    },
    hashCheck: (password, hash) => {
        return bcrypt.compare(password, hash);
    }
}