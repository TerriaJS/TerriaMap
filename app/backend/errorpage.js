module.exports.error404 = function(show404, wwwroot, serveWwwRoot) {
    return function (req, res, next) {
        if (show404) {
            res.status(404).sendFile(wwwroot + '/404.html');
        } else if (serveWwwRoot) {
            // Redirect unknown pages back home.
            res.redirect(303, '/');
        } else {
            res.status(404).send('No TerriaJS website here.');
        }
    };
};

module.exports.error500 = function(show500, wwwroot) {
    return function(error, req, res, next) {
        console.error(error);
        if (show500) {
            res.status(500).sendFile(wwwroot + '/500.html');
        } else {
            res.status(500).send('500: Internal Server Error');
        }
    };
};
