/**
 * Simple publish-subscribe implementation
 */
module.exports = (function () {

    const EventChannels = (function () {

        'use strict';

        const EventChannel = function () {

            let listeners = null;
            let listenerCallback = null;

            const addListener = function (callback) {
                if (typeof callback !== 'function') {
                    throw new Error('Illegal callback');
                }
                if (listeners !== null) {
                    listeners.push(callback);
                    return;
                }
                if (listenerCallback !== null) {
                    listeners = [];
                    listeners.push(listenerCallback);
                    listeners.push(callback);
                    listenerCallback = null;
                } else {
                    listenerCallback = callback;
                }
            };

            const removeListener = function (callback) {
                if (listenerCallback !== null) {
                    listenerCallback = null;
                } else {
                    const index = listeners.indexOf(callback);
                    if (index >= 0) {
                        listeners.splice(index, 1);
                    }
                }
            };

            const notify = function () {
                if (listenerCallback !== null) {
                    return listenerCallback.apply(listenerCallback, arguments);
                }
                if (listeners !== null) {
                    for (let i = 0; i < listeners.length; i++) {
                        const listener = listeners[i];
                        listener.apply(listener, arguments);
                    }
                }
            };

            const notifyInReverseOrder = function () {
                if (listenerCallback !== null) {
                    return listenerCallback.apply(listenerCallback, arguments);
                }
                if (listeners !== null) {
                    for (let i = listeners.length - 1; i >= 0; i--) {
                        const listener = listeners[i];
                        listener.apply(listener, arguments);
                    }
                }
            };

            return {
                addListener: addListener,
                removeListener: removeListener,
                notify: notify,
                notifyInReverseOrder: notifyInReverseOrder
            };
        };

        const namedChannels = Object.create(null);

        const newChannel = function () {
            return new EventChannel();
        };

        const newNamedChannel = function (name) {
            const channel = newChannel();
            namedChannels[name] = channel;
            return channel;
        };

        const getNamedChannel = function (name) {
            return namedChannels[name];
        };

        return {
            newChannel: newChannel,
            newNamedChannel: newNamedChannel,
            getNamedChannel: getNamedChannel
        };

    })();

    return EventChannels;

})();