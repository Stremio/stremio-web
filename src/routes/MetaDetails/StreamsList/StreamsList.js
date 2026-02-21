// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Image, MultiselectMenu } = require('stremio/components');
const { useServices } = require('stremio/services');
const Stream = require('./Stream');
const styles = require('./styles');
const { usePlatform, useProfile } = require('stremio/common');
const { default: SeasonEpisodePicker } = require('../EpisodePicker');

const ALL_ADDONS_KEY = 'ALL';

const parseSeedsFromDescription = (description) => {
    if (typeof description !== 'string') {
        return null;
    }

    const match = description.match(/👤\s*(\d+)/);

    if (!match) {
        return null;
    }

    const parsed = parseInt(match[1], 10);

    return Number.isNaN(parsed) ? null : parsed;
};

const getSeedsValue = (stream) => {
    if (!stream) {
        return null;
    }

    if (typeof stream.behaviorHints === 'object' && stream.behaviorHints !== null) {
        const seeds = stream.behaviorHints.seeds;

        if (typeof seeds === 'number') {
            return seeds;
        }
    }

    return parseSeedsFromDescription(stream.description);
};

const compareBySeeds = (a, b) => {
    const seedsA = getSeedsValue(a);
    const seedsB = getSeedsValue(b);

    const hasSeedsA = typeof seedsA === 'number';
    const hasSeedsB = typeof seedsB === 'number';

    if (hasSeedsA && hasSeedsB) {
        if (seedsA !== seedsB) {
            return seedsB - seedsA;
        }

        const nameA = typeof a.name === 'string' ? a.name : typeof a.addonName === 'string' ? a.addonName : '';
        const nameB = typeof b.name === 'string' ? b.name : typeof b.addonName === 'string' ? b.addonName : '';

        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    }

    if (hasSeedsA && !hasSeedsB) {
        return -1;
    }

    if (!hasSeedsA && hasSeedsB) {
        return 1;
    }

    const nameA = typeof a.name === 'string' ? a.name : typeof a.addonName === 'string' ? a.addonName : '';
    const nameB = typeof b.name === 'string' ? b.name : typeof b.addonName === 'string' ? b.addonName : '';

    if (nameA < nameB) {
        return -1;
    }

    if (nameA > nameB) {
        return 1;
    }

    return 0;
};

const stableSort = (array, comparator) => {
    return array
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
            const order = comparator(a.item, b.item);

            if (order !== 0) {
                return order;
            }

            return a.index - b.index;
        })
        .map(({ item }) => item);
};

const StreamsList = ({ className, video, type, onEpisodeSearch, ...props }) => {
    const { t } = useTranslation();
    const { core } = useServices();
    const platform = usePlatform();
    const profile = useProfile();
    const streamsContainerRef = React.useRef(null);
    const [selectedAddon, setSelectedAddon] = React.useState(ALL_ADDONS_KEY);
    const [sortMode, setSortMode] = React.useState('default');
    const onAddonSelected = React.useCallback((value) => {
        streamsContainerRef.current.scrollTo({ top: 0, left: 0, behavior: platform.name === 'ios' ? 'smooth' : 'instant' });
        setSelectedAddon(value);
    }, [platform]);
    const showInstallAddonsButton = React.useMemo(() => {
        return !profile || profile.auth === null || profile.auth?.user?.isNewUser === true && !video?.upcoming;
    }, [profile, video]);
    const backButtonOnClick = React.useCallback(() => {
        if (video.deepLinks && typeof video.deepLinks.metaDetailsVideos === 'string') {
            window.location.replace(video.deepLinks.metaDetailsVideos + (
                typeof video.season === 'number' ?
                    `?${new URLSearchParams({ 'season': video.season })}`
                    :
                    null
            ));
        } else {
            window.history.back();
        }
    }, [video]);
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
        if (selectedAddon === ALL_ADDONS_KEY) {
            return Object.values(streamsByAddon).map(({ streams }) => streams).flat(1);
        }

        if (streamsByAddon[selectedAddon]) {
            return streamsByAddon[selectedAddon].streams;
        }

        return [];
    }, [streamsByAddon, selectedAddon]);
    const sortedStreams = React.useMemo(() => {
        if (sortMode !== 'seeds') {
            return filteredStreams;
        }

        return stableSort(filteredStreams, compareBySeeds);
    }, [filteredStreams, sortMode]);
    const hasSeeds = React.useMemo(() => {
        return Object.values(streamsByAddon)
            .map(({ streams }) => streams)
            .flat(1)
            .some((stream) => typeof getSeedsValue(stream) === 'number');
    }, [streamsByAddon]);
    const selectableOptions = React.useMemo(() => {
        return {
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
            value: selectedAddon,
            onSelect: onAddonSelected
        };
    }, [streamsByAddon, selectedAddon]);
    const sortButtonOnClick = React.useCallback(() => {
        setSortMode((value) => value === 'seeds' ? 'default' : 'seeds');
    }, []);

    const handleEpisodePicker = React.useCallback((season, episode) => {
        onEpisodeSearch(season, episode);
    }, [onEpisodeSearch]);

    return (
        <div className={classnames(className, styles['streams-list-container'])}>
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
                        <MultiselectMenu
                            {...selectableOptions}
                            className={styles['select-input-container']}
                        />
                        :
                        null
                }
                {
                    hasSeeds ?
                        <Button
                            className={classnames(styles['sort-button-container'], { 'active': sortMode === 'seeds' })}
                            tabIndex={-1}
                            title={t('SORT_BY_SEEDS', { defaultValue: 'Sort by seeds' })}
                            onClick={sortButtonOnClick}
                        >
                            <Icon className={styles['icon']} name={'swap-vertical'} />
                            <div className={styles['sort-label']}>
                                {t('SORT_BY_SEEDS', { defaultValue: 'Sort by seeds' })}
                            </div>
                        </Button>
                        :
                        null
                }
            </div>
            {
                props.streams.length === 0 ?
                    <div className={styles['message-container']}>
                        {
                            type === 'series' ?
                                <SeasonEpisodePicker className={styles['search']} onSubmit={handleEpisodePicker} />
                                : null
                        }
                        <Image className={styles['image']} src={require('/assets/images/empty.png')} alt={' '} />
                        <div className={styles['label']}>{t('ERR_NO_ADDONS_FOR_STREAMS')}</div>
                    </div>
                    :
                    props.streams.every((streams) => streams.content.type === 'Err') ?
                        <div className={styles['message-container']}>
                            {
                                type === 'series' ?
                                    <SeasonEpisodePicker className={styles['search']} onSubmit={handleEpisodePicker} />
                                    : null
                            }
                            {
                                video?.upcoming ?
                                    <div className={styles['label']}>{t('UPCOMING')}...</div>
                                    : null
                            }
                            <Image className={styles['image']} src={require('/assets/images/empty.png')} alt={' '} />
                            <div className={styles['label']}>{t('NO_STREAM')}</div>
                            {
                                showInstallAddonsButton ?
                                    <Button className={styles['install-button-container']} title={t('ADDON_CATALOGUE_MORE')} href={'#/addons'}>
                                        <Icon className={styles['icon']} name={'addons'} />
                                        <div className={styles['label']}>{t('ADDON_CATALOGUE_MORE')}</div>
                                    </Button>
                                    :
                                    null
                            }
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
                                <div className={styles['streams-container']} ref={streamsContainerRef}>
                                    {sortedStreams.map((stream, index) => (
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
                                    {
                                        showInstallAddonsButton ?
                                            <Button className={styles['install-button-container']} title={t('ADDON_CATALOGUE_MORE')} href={'#/addons'}>
                                                <Icon className={styles['icon']} name={'addons'} />
                                                <div className={styles['label']}>{t('ADDON_CATALOGUE_MORE')}</div>
                                            </Button>
                                            :
                                            null
                                    }
                                </div>
                            </React.Fragment>
            }
        </div>
    );
};

StreamsList.propTypes = {
    className: PropTypes.string,
    streams: PropTypes.arrayOf(PropTypes.object).isRequired,
    video: PropTypes.object,
    type: PropTypes.string,
    onEpisodeSearch: PropTypes.func
};

module.exports = StreamsList;
