const useBinaryState = require('stremio/common/useBinaryState');

const useInLibrary = (id) => {
    const [inLibrary, addToLibrary, removeFromLibrary, toggleInLibrary] = useBinaryState(false);
    if (typeof id === 'string') {
        return [inLibrary, addToLibrary, removeFromLibrary, toggleInLibrary];
    } else {
        return [false, null, null, null];
    }
};

module.exports = useInLibrary;
