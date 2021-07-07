// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { Button, Image, useStreamingServer } = require('stremio/common');
const { useServices } = require('stremio/services');
const Stream = require('./Stream');
const styles = require('./styles');

const StreamsList = ({ className, ...props }) => {
    const { core } = useServices();
    const streamingServer = useStreamingServer();
    const isServerOpen = streamingServer.settings.type === 'Ready';
    const streamToMagnetURI = React.useCallback((stream) => {
        const displayName = stream.title || 'Stream';
        const trackers = stream.announce && stream.announce.filter((source) => source.includes('tracker:')).map((source) => `&tr=${source.replace('tracker:', '')}`);
        return encodeURI(`magnet:?dn=${displayName}&xt=urn:btih:${stream.infoHash}${trackers.join()}`);
    });
    const streams = React.useMemo(() => {
        return props.streams
            .filter((streams) => streams.content.type === 'Ready')
            .map((streams) => {
                return streams.content.content.map((stream) => {
                    const externalUrl = !isServerOpen && stream.infoHash ? streamToMagnetURI(stream) : stream.externalUrl;
                    return {
                        ...stream,
                        externalUrl,
                        onClick: () => {
                            core.transport.analytics({
                                event: 'StreamClicked',
                                args: {
                                    stream
                                }
                            });
                        },
                        addonName: streams.addon.manifest.name
                    };
                });
            })
            .flat(1);
    }, [props.streams, isServerOpen]);
    return (
        <div className={classnames(className, styles['streams-list-container'])}>
            {
                props.streams.length === 0 ?
                    <div className={styles['message-container']}>
                        <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                        <div className={styles['label']}>No addons were requested for streams!</div>
                    </div>
                    :
                    props.streams.every((streams) => streams.content.type === 'Err') ?
                        <div className={styles['message-container']}>
                            <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                            <div className={styles['label']}>No streams were found!</div>
                        </div>
                        :
                        streams.length === 0 ?
                            <div className={styles['streams-container']}>
                                <Stream.Placeholder />
                                <Stream.Placeholder />
                            </div>
                            :
                            <div className={styles['streams-container']}>
                                {streams.map((stream, index) => (
                                    <Stream
                                        key={index}
                                        addonName={stream.addonName}
                                        title={stream.title}
                                        thumbnail={stream.thumbnail}
                                        progress={stream.progress}
                                        externalUrl={stream.externalUrl}
                                        deepLinks={stream.deepLinks}
                                        onClick={stream.onClick}
                                    />
                                ))}
                            </div>
            }
            <Button className={styles['install-button-container']} title={'Install Addons'} href={'#/addons'}>
                <Icon className={styles['icon']} icon={'ic_addons'} />
                <div className={styles['label']}>Install Addons</div>
            </Button>
        </div>
    );
};

StreamsList.propTypes = {
    className: PropTypes.string,
    streams: PropTypes.arrayOf(PropTypes.object).isRequired
};

module.exports = StreamsList;
