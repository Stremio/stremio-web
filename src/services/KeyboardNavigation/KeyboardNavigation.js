require('spatial-navigation-polyfill');

const TABS = [
    { href: '#/', key: 'F1' },
    { href: '#/discover', key: 'F2' },
    { href: '#/library', key: 'F3' }
];

function KeyboardNavigation() {
    let active = false;

    function onKeyDown(event) {
        const tab = TABS.find(({ key }) => key === event.key);
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

module.exports = KeyboardNavigation;
