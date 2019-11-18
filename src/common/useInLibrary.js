const { useBinaryState } = require('stremio/common');

const useInLibrary = () => {
    const [inLibrary, addToLibrary, removeFromLibrary, toggleInLibrary] = useBinaryState(false);
    return [inLibrary, addToLibrary, removeFromLibrary, toggleInLibrary];
};

module.exports = useInLibrary;
