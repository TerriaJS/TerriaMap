/*global self:true*/
// make sure self is defined so that the Dojo build can evaluate this file without crashing.
if (typeof self === 'undefined') {
    self = {};
}

self.onmessage = function(event) {
    'use strict';
    var array = event.data.array;
    var postMessage = self.webkitPostMessage || self.postMessage;

    try {
        // transfer the test array back to the caller
        postMessage({
            array : array
        }, [array.buffer]);
    } catch (e) {
        postMessage({});
    }
};
