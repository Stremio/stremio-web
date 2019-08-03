require('spatial-navigation-polyfill');

const TABS = [
    { href: '#/', keyCode: 112 },
    { href: '#/discover', keyCode: 113 },
    { href: '#/library', keyCode: 114 },
    { href: '#/calendar', keyCode: 115 }
];

function KeyboardNavigation() {
    var active = false;

    function onKeyDown(event) {
        const tab = TABS.find(({ keyCode }) => event.keyCode === keyCode);
        if (tab) {
            event.preventDefault();
            window.location = tab.href;
        }
    }
    function start() {
        if (active) {
            return;
        }

        window.addEventListener('keydown', onKeyDown);
        active = true;
    }
    function stop() {
        if (!active) {
            return;
        }

        window.removeEventListener('keydown', onKeyDown);
        active = false;
    }

    Object.defineProperties(this, {
        active: {
            configurable: false,
            enumerable: true,
            get: function() {
                return active;
            }
        }
    });

    this.start = start;
    this.stop = stop;

    Object.freeze(this);
};

Object.freeze(KeyboardNavigation);

module.exports = KeyboardNavigation;
