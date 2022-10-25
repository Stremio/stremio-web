// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { Button, Image, Multiselect } = require('stremio/common');
const { useServices } = require('stremio/services');
const Stream = require('./Stream');
const styles = require('./styles');

const ALL_ADDONS_KEY = 'ALL';

const StreamsList = ({ className, ...props }) => {
    const { core } = useServices();
    const [selectedAddon, setSelectedAddon] = React.useState(ALL_ADDONS_KEY);
    const onAddonSelected = React.useCallback((event) => {
        setSelectedAddon(event.value);
    }, []);
    const streams = React.useMemo(() => {
        return props.streams
            .filter((streams) => streams.content.type === 'Ready')
            .map((streams) => {
                return streams.content.content.map((stream) => ({
                    ...stream,
                    onClick: () => {
                        core.transport.analytics({
                            event: 'StreamClicked',
                            args: {
                                stream
                            }
                        });
                    },
                    transportUrl: streams.addon.transportUrl,
                    addonName: streams.addon.manifest.name
                }));
            })
            .flat(1);
    }, [props.streams]);
    const filteredStreams = React.useMemo(() => {
        return selectedAddon === ALL_ADDONS_KEY ?
            streams
            :
            streams.filter((stream) => stream.transportUrl === selectedAddon);
    }, [streams, selectedAddon]);
    const selectableOptions = React.useMemo(() => {
        const transportUrls = [...new Set(streams.map(({ transportUrl }) => transportUrl))];
        const sortedStreams = transportUrls.map((transportUrl) => streams.filter((stream) => stream.transportUrl === transportUrl));
        return {
            title: 'Select Addon',
            options: [
                {
                    value: ALL_ADDONS_KEY,
                    label: 'All',
                    title: 'All'
                },
                ...sortedStreams.map((streams) => ({
                    value: streams[0].transportUrl,
                    label: streams[0].addonName,
                    title: streams[0].addonName
                }))
            ],
            selected: [selectedAddon],
            onSelect: onAddonSelected
        };
    }, [streams, selectedAddon]);
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
                        filteredStreams.length === 0 ?
                            <div className={styles['streams-container']}>
                                <Stream.Placeholder />
                                <Stream.Placeholder />
                            </div>
                            :
                            <React.Fragment>
                                <Multiselect
                                    {...selectableOptions}
                                    className={styles['select-input-container']}
                                />
                                <div className={styles['streams-container']}>
                                    {filteredStreams.map((stream, index) => (
                                        <Stream
                                            key={index}
                                            addonName={stream.addonName}
                                            name={stream.name}
                                            description={stream.description}
                                            thumbnail={stream.thumbnail}
                                            progress={stream.progress}
                                            deepLinks={stream.deepLinks}
                                            onClick={stream.onClick}
                                        />
                                    ))}
                                </div>
                            </React.Fragment>
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
