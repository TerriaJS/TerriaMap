var fs = require('fs');

module.exports = function exists(pathName) {
    try {
        fs.statSync(pathName);
        return true;
    } catch (e) {
        return false;
    }
};