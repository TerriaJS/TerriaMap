'use strict';

var LRUCache = require('lru-cache'); // Cache for storing rendered pages.

// This is the routes file for the framework. You can add or modify routes here.

// Single page application is good but it has an initial overhead of high loading time which is very bad for Search Engine Optimisation (SEO) / Google Analytics / Crawlers.
// Currently, we load the whole static website files in one go which results in high loading times. 
// To alleviate this problem we use what we call Lazy loading in the framework for our routes via asynchronous loading and automatic code splitting.
// We only want to load what is needed to render the required page, we keep this files loaded in server memory.

class routes {

    public static cache;

    public static init(app: any, options: any) {

        cache = new LRUCache({
            max: 100,
            maxAge: 1000 * 60 * 60 // 1hour
        });

        // First page load asynchronous logic here and endpoint routes
        app.get('/', (req, res) => {
          renderAndCache(req, res, '/')
        })

    }

    public static async renderAndStore(req: any, res: any, path: string, params: any) {

        // For every page rendered, we store it in the cache asynchronously and re-render it.
        // The rendered HTML will have markings that uses the generated distribution files in /dist directory, any linked files in the markup.
        var key = getCacheKey(req);

        // If the requested page is in the cache, we serve it.
        if(this.cache.has(key)) {
            res.setHeader('x-cache', 'Cached'); 
            res.send(cache.get(key));
        }

        try {

            // If not let's render the page into HTML
            const html = await routes.generateHTML(req, res, path, params)

            // Something is wrong with the request, let's skip the cache
            if (res.statusCode !== 200) {
              res.send(html)
              return void;
            }

            // Let's cache this page
            this.cache.set(key, html)

            res.setHeader('x-cache', 'Not Cached')
            res.send(html)

        } catch (err) {
            // Render error page here
        }

    }

    public static generateHTML(req,res, path, params) {

        // Convert page to html here

    }

    public static handleFirstLoad() {

        // Logic for handling the globe map terriajs-cesium application - /index.html
        // We'll use SSR that waits for client ready event before passing it to client-side rendering.

    }

}

export = routes;