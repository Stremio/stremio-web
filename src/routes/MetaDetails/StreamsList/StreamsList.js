// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Image, Multiselect } = require('stremio/common');
const { useServices } = require('stremio/services');
const Stream = require('./Stream');
const styles = require('./styles');

const ALL_ADDONS_KEY = 'ALL';

const StreamsList = ({ className, video, ...props }) => {
    const { t } = useTranslation();
    const { core } = useServices();
    const [selectedAddon, setSelectedAddon] = React.useState(ALL_ADDONS_KEY);
    const onAddonSelected = React.useCallback((event) => {
        setSelectedAddon(event.value);
    }, []);
    const backButtonOnClick = React.useCallback(() => {
        window.history.back();
    }, []);
    const countLoadingAddons = React.useMemo(() => {
        return props.streams.filter((stream) => stream.content.type === 'Loading').length;
    }, [props.streams]);
    const streamsByAddon = React.useMemo(() => {
        return props.streams
            .filter((streams) => streams.content.type === 'Ready')
            .reduce((streamsByAddon, streams) => {
                streamsByAddon[streams.addon.transportUrl] = {
                    addon: streams.addon,
                    streams: streams.content.content.map((stream) => ({
                        ...stream,
                        onClick: () => {
                            core.transport.analytics({
                                event: 'StreamClicked',
                                args: {
                                    stream
                                }
                            });
                        },
                        addonName: streams.addon.manifest.name
                    }))
                };

                return streamsByAddon;
            }, {});
    }, [props.streams]);
    const filteredStreams = React.useMemo(() => {
        return selectedAddon === ALL_ADDONS_KEY ?
            Object.values(streamsByAddon).map(({ streams }) => streams).flat(1)
            :
            streamsByAddon[selectedAddon] ?
                streamsByAddon[selectedAddon].streams
                :
                [];
    }, [streamsByAddon, selectedAddon]);
    const selectableOptions = React.useMemo(() => {
        return {
            title: 'Select Addon',
            options: [
                {
                    value: ALL_ADDONS_KEY,
                    label: t('ALL_ADDONS'),
                    title: t('ALL_ADDONS')
                },
                ...Object.keys(streamsByAddon).map((transportUrl) => ({
                    value: transportUrl,
                    label: streamsByAddon[transportUrl].addon.manifest.name,
                    title: streamsByAddon[transportUrl].addon.manifest.name,
                }))
            ],
            selected: [selectedAddon],
            onSelect: onAddonSelected
        };
    }, [streamsByAddon, selectedAddon]);
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
                            <div className={styles['label']}>{t('NO_STREAM')}</div>
                        </div>
                        :
                        filteredStreams.length === 0 ?
                            <div className={styles['streams-container']}>
                                <Stream.Placeholder />
                                <Stream.Placeholder />
                            </div>
                            :
                            <React.Fragment>
                                {
                                    countLoadingAddons > 0 ?
                                        <div className={styles['addons-loading-container']}>
                                            <div className={styles['addons-loading']}>
                                                {countLoadingAddons} {t('MOBILE_ADDONS_LOADING')}
                                            </div>
                                            <span className={styles['addons-loading-bar']}></span>
                                        </div>
                                        :
                                        null
                                }
                                <div className={styles['select-choices-wrapper']}>
                                    {
                                        video ?
                                            <React.Fragment>
                                                <Button className={classnames(styles['button-container'], styles['back-button-container'])} tabIndex={-1} onClick={backButtonOnClick}>
                                                    <Icon className={styles['icon']} name={'chevron-back'} />
                                                </Button>
                                                <div className={styles['episode-title']}>
                                                    {`S${video?.season}E${video?.episode} ${(video?.title)}`}
                                                </div>
                                            </React.Fragment>
                                            :
                                            null
                                    }
                                    {
                                        Object.keys(streamsByAddon).length > 1 ?
                                            <Multiselect
                                                {...selectableOptions}
                                                className={styles['select-input-container']}
                                            />
                                            :
                                            null
                                    }
                                </div>
                                <div className={styles['streams-container']}>
                                    {filteredStreams.map((stream, index) => (
                                        <Stream
                                            key={index}
                                            videoId={video?.id}
                                            videoReleased={video?.released}
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
            <Button className={styles['install-button-container']} title={t('ADDON_CATALOGUE_MORE')} href={'#/addons'}>
                <Icon className={styles['icon']} name={'addons'} />
                <div className={styles['label']}>{ t('ADDON_CATALOGUE_MORE') }</div>
            </Button>
        </div>
    );
};

StreamsList.propTypes = {
    className: PropTypes.string,
    streams: PropTypes.arrayOf(PropTypes.object).isRequired,
    video: PropTypes.object
};

module.exports = StreamsList;
