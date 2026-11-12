// Copyright (C) 2017-2023 Smart code 203358507

const Addons = require('./Addons');
const Board = require('./Board');
const Discover = require('./Discover');
const Library = require('./Library');
const Calendar = require('./Calendar').default;
const { default: Details } = require('./Details');
const NotFound = require('./NotFound');
const Search = require('./Search');
const { default: Settings } = require('./Settings');
const Player = require('./Player');
const Intro = require('./Intro');

module.exports = {
    Addons,
    Board,
    Discover,
    Library,
    Calendar,
    Details,
    NotFound,
    Search,
    Settings,
    Player,
    Intro
};
