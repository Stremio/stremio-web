// Copyright (C) 2017-2022 Smart code 203358507

const EventEmitter = require('eventemitter3');

function Shell() {
    let active = false;
    let error = null;
    let starting = false;

    const events = new EventEmitter();

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
        },
        error: {
            configurable: false,
            enumerable: true,
            get: function() {
                return error;
            }
        },
        starting: {
            configurable: false,
            enumerable: true,
            get: function() {
                return starting;
            }
        }
    });

    this.start = function() {
        if (active || error instanceof Error || starting) {
            return;
        }

        active = false;
        error = new Error('Stremio Shell API not available');
        starting = false;
        onStateChanged();
    };
    this.stop = function() {
        active = false;
        error = null;
        starting = false;
        onStateChanged();
    };
    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };

    this.props = {};
    const shell = this;
    window.initShellComm = function () {
        var transport = window.qt && window.qt.webChannelTransport;
        if (!transport) throw 'no viable transport found (qt.webChannelTransport)';

        active = false;
        starting = true;
        error = null;

        var QtMsgTypes = {
            signal: 1,
            propertyUpdate: 2,
            init: 3,
            idle: 4,
            debug: 5,
            invokeMethod: 6,
            connectToSignal: 7,
            disconnectFromSignal: 8,
            setProperty: 9,
            response: 10,
        };
        var QtObjId = 'transport'; // the ID of our transport object

        var id = 0;
        function send(msg) {
            msg.id = id++;
            transport.send(JSON.stringify(msg));
        }

        transport.onmessage = function (message) {
            var msg = JSON.parse(message.data);
            if (msg.id === 0) {
                var obj = msg.data[QtObjId];

                obj.properties.slice(1).forEach(function (prop) {
                    shell.props[prop[1]] = prop[3];
                });
                if (typeof shell.props.shellVersion === 'string') {
                    shell.shellVersionArr = (
                        shell.props.shellVersion.match(/(\d+)\.(\d+)\.(\d+)/) || []
                    )
                        .slice(1, 4)
                        .map(Number);
                }
                events.emit('received-props', shell.props);

                obj.signals.forEach(function (sig) {
                    send({
                        type: QtMsgTypes.connectToSignal,
                        object: QtObjId,
                        signal: sig[1],
                    });
                });

                var onEvent = obj.methods.filter(function (x) {
                    return x[0] === 'onEvent';
                })[0];

                shell.send = function (ev, args) {
                    send({
                        type: QtMsgTypes.invokeMethod,
                        object: QtObjId,
                        method: onEvent[1],
                        args: [ev, args || {}],
                    });
                };
                starting = false;
                active = true;
                error = null;

                shell.send('app-ready', {}); // signal that we're ready to take events
            }

            if (msg.object === QtObjId && msg.type === QtMsgTypes.signal)
                events.emit(msg.args[0], msg.args[1]);
            onStateChanged();
        };
        send({ type: QtMsgTypes.init });
    };
}

module.exports = Shell;
