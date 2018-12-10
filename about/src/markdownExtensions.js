import React from 'react';

// export a function called `renderer`
module.exports = exports = function renderer({
  Marked,      // The Marked instance you want to extend
  _ID,         // The ID of the current page
  _parents,    // An array of all parent pages IDs
  _storeSet,   // The store setter
  _store,      // The store getter
  _nav,        // A nested object of your site structure
  _relativeURL // A helper function to make an absolute URL relative
}) {
  
  <iframe width="848" height="636" src="https://www.youtube.com/embed/gsEAq0x0xh4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

  Marked.link = ( href, title, text ) => {
    if( href.includes('youtube') || href.startsWith('vimeo') ) {
      return `<iframe width="848" 
                      height="636" 
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen src=${href} alt=${text}></iframe>`
    } else {
      return `<a href="${ href }" ${ title ? ` title="${ title }"` : '' }>${ text }</a>`
    }  
  };
  return Marked;
};