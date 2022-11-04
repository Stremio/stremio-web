// Copyright (C) 2017-2022 Smart code 203358507

const CHROMECAST_RECEIVER_APP_ID = "1634F54B";
const SUBTITLES_SIZES = [75, 100, 125, 150, 175, 200, 250];
const SUBTITLES_FONTS = [
  "Roboto",
  "Arial",
  "Halvetica",
  "Times New Roman",
  "Verdana",
  "Courier",
  "Lucida Console",
  "sans-serif",
  "serif",
  "monospace",
];
const SEEK_TIME_DURATIONS = [5000, 10000, 15000, 20000, 25000, 30000];
const CATALOG_PREVIEW_SIZE = 10;
const CATALOG_PAGE_SIZE = 100;
const NONE_EXTRA_VALUE = "None";
const SKIP_EXTRA_NAME = "skip";
const META_LINK_CATEGORY = "meta";
const IMDB_LINK_CATEGORY = "imdb";
const SHARE_LINK_CATEGORY = "share";
const WRITERS_LINK_CATEGORY = "Writers";
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
  other: -Infinity,
};

module.exports = {
  CHROMECAST_RECEIVER_APP_ID,
  SUBTITLES_SIZES,
  SUBTITLES_FONTS,
  SEEK_TIME_DURATIONS,
  CATALOG_PREVIEW_SIZE,
  CATALOG_PAGE_SIZE,
  NONE_EXTRA_VALUE,
  SKIP_EXTRA_NAME,
  META_LINK_CATEGORY,
  IMDB_LINK_CATEGORY,
  SHARE_LINK_CATEGORY,
  WRITERS_LINK_CATEGORY,
  TYPE_PRIORITIES,
};
