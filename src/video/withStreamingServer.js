// Copyright (C) 2017-2020 Smart code 203358507

var UrlUtils = require('url');
var EventEmitter = require('events');
var parseVideoName = require('video-name-parser');

var VIDEO_FILE_EXTENTIONS = /.mkv$|.avi$|.mp4$|.wmv$|.vp8$|.mov$|.mpg$|.ts$|.webm$/i;

function createTorrent(streamingServerUrl, infoHash, sources) {
    return fetch(UrlUtils.resolve(streamingServerUrl, `/${encodeURIComponent(infoHash)}/create`), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            torrent: {
                infoHash,
                peerSearch: {
                    sources: [`dht:${infoHash}`].concat(Array.isArray(sources) ? sources : []),
                    min: 40,
                    max: 150
                }
            }
        })
    }).then(function(resp) {
        return resp.json();
    }).catch(function(error) {
        throw {
            message: 'Unable to get files from torrent',
            critical: true,
            error: error
        };
    }).then(function(resp) {
        if (!resp || !Array.isArray(resp.files) || resp.files.length === 0) {
            throw {
                message: 'Unable to get files from torrent',
                critical: true
            };
        }

        return resp;
    });
}

function guessFileIdx(files, seriesInfo) {
    var videoFilesForEpisode = files.filter(function(file) {
        if (seriesInfo && file.path.match(VIDEO_FILE_EXTENTIONS)) {
            try {
                var info = parseVideoName(file.path);
                return !isNaN(info.season) && Array.isArray(info.episode) &&
                    info.season === seriesInfo.season && info.episode.indexOf(seriesInfo.episode) !== -1;
            } catch (e) {
                return false;
            }
        }
    });
    var largestFile = (videoFilesForEpisode.length > 0 ? videoFilesForEpisode : files)
        .reduce((result, file) => {
            if (!result || file.length > result.length) {
                return file;
            }

            return result;
        }, null);
    return files.indexOf(largestFile);
}

function withStreamingServer(Video) {
    function StreamingServerVideo(options) {
        var video = new Video(options);
        var events = new EventEmitter();

        var destroyed = false;
        var stream = null;

        events.on('error', function() { });

        function onError(error) {
            events.emit('error', error);
            if (error.critical) {
                stop();
                video.dispatch({ commandName: 'stop' });
            }
        }
        function stop() {
            stream = null;
        }
        function load(args) {
            video.dispatch({ commandName: 'stop' });
            stream = args.stream;
            new Promise(function(resolve, reject) {
                if (typeof args.stream.ytId === 'string') {
                    resolve(UrlUtils.resolve(args.streamingServerUrl, `/yt/${encodeURIComponent(args.stream.ytId)}?${new URLSearchParams([['request', Date.now()]])}`));
                    return;
                }

                if (typeof args.stream.infoHash === 'string') {
                    if (args.stream.fileIdx !== null && !isNaN(args.stream.fileIdx)) {
                        resolve(UrlUtils.resolve(args.streamingServerUrl, `/${args.stream.infoHash}/${args.stream.fileIdx}`));
                    } else {
                        createTorrent(args.streamingServerUrl, args.stream.infoHash, args.stream.sources)
                            .then(function(resp) {
                                var fileIdx = guessFileIdx(resp.files, args.stream.seriesInfo);
                                resolve(UrlUtils.resolve(args.streamingServerUrl, `/${args.stream.infoHash}/${fileIdx}`));
                            })
                            .catch(function(error) {
                                reject(error);
                            });
                    }
                    return;
                }

                reject({
                    message: 'Unable to play stream',
                    critical: true,
                    stream: args.stream
                });
            }).then(function(url) {
                if (destroyed || args.stream !== stream) {
                    return;
                }

                video.dispatch({
                    commandName: 'load',
                    commandArgs: {
                        autoplay: args.autoplay,
                        time: args.time,
                        stream: {
                            url: url
                        }
                    }
                });
            }).catch(function(error) {
                if (destroyed || args.stream !== stream) {
                    return;
                }

                onError(error);
            });
        }
        function destroy() {
            stop();
            destroyed = true;
            events.removeAllListeners();
            events.on('error', function() { });
        }

        this.on = function(eventName, listener) {
            if (!destroyed) {
                events.on(eventName, listener);
            }

            video.on(eventName, listener);
        };
        this.dispatch = function(args) {
            if (!destroyed && args) {
                if (typeof args.commandName === 'string') {
                    switch (args.commandName) {
                        case 'stop': {
                            stop();
                            break;
                        }
                        case 'load': {
                            load(args.commandArgs);
                            return;
                        }
                        case 'destroy': {
                            destroy();
                            break;
                        }
                    }
                }
            }

            video.dispatch(args);
        };

        Object.freeze(this);
    }

    StreamingServerVideo.manifest = Object.freeze({
        name: Video.manifest.name + 'WithStreamingServer',
        embedded: true,
        props: Object.freeze(Video.manifest.props)
    });

    Object.freeze(StreamingServerVideo);

    return StreamingServerVideo;
}

module.exports = withStreamingServer;
