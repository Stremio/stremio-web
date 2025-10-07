// Copyright (C) 2017-2025 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const CONSTANTS = require('stremio/common/CONSTANTS');

// Helper function to create a console logger to see what data is available
// but only in dev mode to avoid logging in production
const debugLog = (data) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('MetaItem debug:', data);
    }
};

// Helper function to extract genres from links array
const extractGenres = (links) => {
    if (!Array.isArray(links)) {
        return null;
    }
    
    // Look for links with category 'genre' or similar
    const genreLinks = links.filter(link => 
        link && typeof link.category === 'string' && 
        (link.category.toLowerCase() === 'genre' || link.category.toLowerCase() === 'genres')
    );
    
    if (genreLinks.length === 0) {
        return null;
    }
    
    return genreLinks.map(link => link.name);
};

// Helper function to extract IMDb rating from links
const extractImdbRating = (links) => {
    if (!Array.isArray(links)) {
        return null;
    }
    
    const imdbLink = links.find(link => 
        link && link.category === CONSTANTS.IMDB_LINK_CATEGORY && typeof link.name === 'string'
    );
    
    return imdbLink ? imdbLink.name : null;
};

// Creates a MetaItemEnhancer that enhances a MetaItem with hover preview data
const MetaItemEnhancer = {
    enhance: (metaItem) => {
        // Debug the first item once to see what data is available
        if (process.env.NODE_ENV !== 'production' && !MetaItemEnhancer._logged) {
            debugLog(metaItem);
            MetaItemEnhancer._logged = true;
        }
        
        if (!metaItem) {
            return metaItem;
        }
        
        return {
            ...metaItem,
            genres: extractGenres(metaItem.links),
            imdbRating: extractImdbRating(metaItem.links)
        };
    },
    _logged: false
};

module.exports = MetaItemEnhancer;