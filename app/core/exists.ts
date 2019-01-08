var fs = require('fs');

export = function exists(pathName) {
    try {
        fs.statSync(pathName);
        return true;
    } catch (e) {
        return false;
    }
};