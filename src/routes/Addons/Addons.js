import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Addon from './Addon';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const ADDON_CATEGORIES = {
    OFFICIAL: 1,
    COMMUNITY: 2,
    MY: 3
};

const ADDON_TYPES = {
    All: -1,
    Movies: 0,
    Series: 1,
    Channels: 2,
    Others: 3
};

const DEFAULT_TYPE = 'All';

class Addons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCategory: ADDON_CATEGORIES.OFFICIAL,
            selectedAddonType: DEFAULT_TYPE
        };
    }

    changeSelectedCategory = (event) => {
        event.currentTarget.blur();
        this.setState({ selectedCategory: ADDON_CATEGORIES[event.currentTarget.dataset.category] });
    }

    changeSelectedAddonType = (event) => {
        event.currentTarget.blur();
        this.setState({ selectedAddonType: event.currentTarget.dataset.type })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.selectedCategory !== this.state.selectedCategory ||
            nextState.selectedAddonType !== this.state.selectedAddonType;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedCategory !== prevState.selectedCategory || !this.getAddonTypes().includes(this.state.selectedAddonType)) {
            this.setState({ selectedAddonType: DEFAULT_TYPE })
        }
    }

    getAddonTypes() {
        const addonTypes = this.props.addons
            .filter((addon) => {
                if (this.state.selectedCategory === ADDON_CATEGORIES.OFFICIAL) return addon.isOfficial === true;
                if (this.state.selectedCategory === ADDON_CATEGORIES.COMMUNITY) return addon.isOfficial === false;
                if (this.state.selectedCategory === ADDON_CATEGORIES.MY) return addon.isInstalled === true;
            })
            .map((addon) => addon.types)
            .join()
            .split(',')
            .filter((type, index, types) => types.indexOf(type) === index)
            .sort(function(a, b) {
                const valueA = ADDON_TYPES[a];
                const valueB = ADDON_TYPES[b];
                if (!isNaN(valueA) && !isNaN(valueB)) return valueA - valueB;
                if (!isNaN(valueA)) return -1;
                if (!isNaN(valueB)) return 1;
                return a - b;
            });

        return addonTypes;
    }

    render() {
        return (
            <div className={styles['addons-container']}>
                <div className={styles['side-menu']}>
                    <div className={styles['add-addon-container']}>
                        <Icon className={styles['add-addon-icon']} icon={'ic_plus'} />
                        <div className={styles['add-addon-label']}>Add new Add-On</div>
                    </div>
                    {Object.keys(ADDON_CATEGORIES).map((category) =>
                        <div className={classnames(styles['label'], { [styles['selected']]: this.state.selectedCategory === ADDON_CATEGORIES[category] })} tabIndex={'0'} key={category} data-category={category} onClick={this.changeSelectedCategory}>
                            {category}
                        </div>
                    )}
                    <div className={classnames(styles['label'], { [styles['selected']]: this.state.selectedAddonType === DEFAULT_TYPE })} tabIndex={'0'} data-type={DEFAULT_TYPE} onClick={this.changeSelectedAddonType}>
                        All
                    </div>
                    {this.getAddonTypes().map((type) =>
                        <div className={classnames(styles['label'], { [styles['selected']]: this.state.selectedAddonType === type })} tabIndex={'0'} key={type} data-type={type} onClick={this.changeSelectedAddonType}>
                            {type}
                        </div>
                    )}
                </div>
                <div className={styles['scroll-container']}>
                    {this.props.addons
                        .filter((addon) => {
                            if (this.state.selectedCategory === ADDON_CATEGORIES.OFFICIAL) return addon.isOfficial === true;
                            if (this.state.selectedCategory === ADDON_CATEGORIES.COMMUNITY) return addon.isOfficial === false;
                            if (this.state.selectedCategory === ADDON_CATEGORIES.MY) return addon.isInstalled === true;
                        })
                        .filter((addon) => {
                            return this.state.selectedAddonType === DEFAULT_TYPE ||
                                addon.types.indexOf(this.state.selectedAddonType) !== -1;
                        })
                        .map((addon) =>
                            <Addon key={addon.name}
                                className={styles['addon']}
                                logo={addon.logo}
                                name={addon.name}
                                version={addon.version}
                                isOfficial={addon.isOfficial}
                                isInstalled={addon.isInstalled}
                                types={addon.types}
                                hostname={addon.hostname}
                                description={addon.description}
                            />
                        )}
                </div>
            </div>
        );
    }
}

Addons.propTypes = {
    addons: PropTypes.arrayOf(PropTypes.object).isRequired
};
Addons.defaultProps = {
    addons: [
        { logo: 'ic_series', name: 'Watch Hub', version: '1.3.0', isOfficial: true, isInstalled: false, types: ['ovies', 'Series'], hostname: 'piratebay-stremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuapp.com', description: 'Find where to stream your favourite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.' },
        { name: 'Cinemeta', version: '2.4.0', isOfficial: false, isInstalled: true, types: ['Moies', 'Series'], hostname: 'stremio-zooqle.now.sh', description: 'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { logo: 'ic_youtube_small', name: 'YouTube', version: '1.3.0', isOfficial: false, isInstalled: true, types: ['Channels', 'Videos'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { name: 'OpenSubtitles', version: '1.3.0', isOfficial: false, isInstalled: false, types: ['Movie', 'Seies'], description: 'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { logo: 'ic_series', name: 'Zooqle', version: '1.3.0', isOfficial: true, isInstalled: false, types: ['Movies', 'Series'], hostname: 'pct.best4stremio.space', description: 'Find where to stream your favourite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.' },
        { name: 'PirateBay Addon', version: '2.4.0', isOfficial: false, isInstalled: true, types: ['Movies', 'eries'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { logo: 'ic_youtube_small', name: 'Popcorn Time', version: '1.3.0', isOfficial: false, isInstalled: true, types: ['Channels', 'Videos'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { name: 'IBERIAN', version: '1.3.0', isOfficial: false, isInstalled: true, types: ['Movies', 'Other'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { logo: 'ic_series', name: 'Ex Addon', version: '1.3.0', isOfficial: false, isInstalled: false, types: ['Movies', 'Series'], hostname: 'pct.best4stremio.space', description: 'Find where to stream your favourite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.' },
        { name: 'Juan Carlos', version: '2.4.0', isOfficial: false, isInstalled: true, types: ['Movies', 'Seris', 'Channels'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { logo: 'ic_youtube_small', name: 'Juan Carlos Torrents', version: '1.3.0', isOfficial: false, isInstalled: true, types: ['Channels', 'Videos'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { name: 'Juan Carlos 2', version: '1.3.0', isOfficial: false, isInstalled: false, types: ['Moes', 'Serie'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { logo: 'ic_series', name: 'Netflix', version: '1.3.0', isOfficial: true, isInstalled: false, types: ['Movies', 'Series'], hostname: 'pct.best4stremio.space', description: 'Find where to stream your favourite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.' },
        { name: 'Anime Addon', version: '2.4.0', isOfficial: false, isInstalled: true, types: ['Movies', 'Series'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { logo: 'ic_youtube_small', name: 'DTube', version: '1.3.0', isOfficial: true, isInstalled: true, types: ['hannels', 'Videos'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notified when they upload new videos.' },
        { name: 'Mixer', version: '1.3.0', isOfficial: false, isInstalled: true, types: ['Movies', 'Series'], hostname: 'pct.best4stremio.space', description: 'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.' }
    ]
};

export default Addons;
