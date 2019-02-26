var events = require("events");

var ipc = new events.EventEmitter();

ipc.props = { };
ipc.send = function() { };
ipc.isDesktop = false;

// New method of communication
function initShellComm() {
	var transport = window.qt && window.qt.webChannelTransport
	if (! transport) throw "no viable transport found (qt.webChannelTransport)"

	ipc.isDesktop = true;

	var QtMsgTypes = { signal: 1, propertyUpdate: 2, init: 3, idle: 4, debug: 5, invokeMethod: 6, connectToSignal: 7, disconnectFromSignal: 8, setProperty: 9, response: 10 };
	var QtObjId = "transport"; // the ID of our transport object

	var id = 0;
	function send(msg) {
		msg.id = id++;
		transport.send(JSON.stringify(msg))
	}

	transport.onmessage = function(message) {
		var msg = JSON.parse(message.data)

		if (msg.id === 0) {
			var obj = msg.data[QtObjId]

			obj.properties.slice(1).forEach(function(prop) {
				ipc.props[prop[1]] = prop[3]
			})
			ipc.emit("received-props", ipc.props)

			obj.signals.forEach(function(sig) {
				send({ type: QtMsgTypes.connectToSignal, object: QtObjId, signal: sig[1] }) 
			})

			var onEvent = obj.methods.filter(function(x) { return x[0] === "onEvent" })[0]
		
			ipc.send = function(ev, args) {
				send({ type: QtMsgTypes.invokeMethod, object: QtObjId, method: onEvent[1], args: [ev, args || { }] })
			}
			ipc.send("app-ready", { }) // signal that we're ready to take events
		}

		if (msg.object == QtObjId && msg.type === QtMsgTypes.signal) ipc.emit(msg.args[0], msg.args[1])
	}

	send({ type: QtMsgTypes.init })
}

module.exports = ipc;