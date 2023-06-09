// Copyright (C) 2017-2023 Smart code 203358507

const EventEmitter = require('eventemitter3');

function DragAndDrop({ core }) {
    let active = false;

    const events = new EventEmitter();

    function onDragOver(event) {
        event.preventDefault();
    }
    async function onDrop(event) {
        event.preventDefault();
        if (event.dataTransfer.files instanceof FileList && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            switch (file.type) {
                case 'application/x-bittorrent': {
                    try {
                        const torrent = await file.arrayBuffer();
                        core.transport.dispatch({
                            action: 'StreamingServer',
                            args: {
                                action: 'CreateTorrent',
                                args: Array.from(new Uint8Array(torrent))
                            }
                        });
                    } catch (error) {
                        events.emit('error', {
                            message: 'Failed to process file',
                            file: {
                                name: file.name,
                                type: file.type
                            }
                        });
                    }
                    break;
                }
                default: {
                    events.emit('error', {
                        message: 'Unsupported file',
                        file: {
                            name: file.name,
                            type: file.type
                        }
                    });
                }
            }
        }
    }
    function onStateChanged() {
        events.emit('stateChanged');
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

    this.start = function() {
        if (active) {
            return;
        }

        window.addEventListener('dragover', onDragOver);
        window.addEventListener('drop', onDrop);
        active = true;
        onStateChanged();
    };
    this.stop = function() {
        window.removeEventListener('dragover', onDragOver);
        window.removeEventListener('drop', onDrop);
        active = false;
        onStateChanged();
    };
    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
}

module.exports = DragAndDrop;
