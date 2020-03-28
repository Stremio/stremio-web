const SUBTITLES_SIZES = [75, 100, 125, 150, 175, 200, 250];
const SUBTITLES_FONTS = ['Roboto', 'Arial', 'Halvetica', 'Times New Roman', 'Verdana', 'Courier', 'Lucida Console', 'sans-serif', 'serif', 'monospace'];
const CATALOG_PREVIEW_SIZE = 10;
const CATALOG_PAGE_SIZE = 100;
const NONE_EXTRA_VALUE = 'None';
const SKIP_EXTRA_NAME = 'skip';
const TYPE_PRIORITIES = {
    movie: 10,
    series: 9,
    channel: 8,
    tv: 7,
    music: 6,
    radio: 5,
    podcast: 4,
    game: 3,
    book: 2,
    adult: 1,
    other: -Infinity
};

module.exports = {
    SUBTITLES_SIZES,
    SUBTITLES_FONTS,
    CATALOG_PREVIEW_SIZE,
    CATALOG_PAGE_SIZE,
    NONE_EXTRA_VALUE,
    SKIP_EXTRA_NAME,
    TYPE_PRIORITIES
};
